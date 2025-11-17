import Navbar from "../_components/navbar";
import { db } from "../_lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function RankingPage() {
  const users = await db.userXp.findMany({
    orderBy: [
      { level: "desc" }, // nível mais alto vem primeiro
      { xp: "desc" }, // se empatar nível, xp decide
    ],
    take: 100, // top 100 (ou remova para pegar todos)
  });

  // Buscar informações do Clerk
  const clerkUsers = await Promise.all(
    users.map(async (u) => {
      const clerk = await fetch(`https://api.clerk.com/v1/users/${u.userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
        cache: "no-store",
      }).then((r) => r.json());

      return {
        ...u,
        image: clerk.image_url,
        name: clerk.first_name || clerk.username || "Jogador",
      };
    })
  );

  const loggedUser = await currentUser();

  return (
    <>
      <Navbar />

      <div className="p-10 max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Ranking Global</h1>

        <p className="text-muted-foreground">
          Veja os jogadores mais experientes do FinPlay!
        </p>

        <div className="space-y-4">
          {clerkUsers.map((player, index) => {
            const isYou = player.userId === loggedUser?.id;

            return (
              <div
                key={player.userId}
                className={`flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm ${
                  isYou ? "border-primary bg-primary/10" : ""
                }`}
              >
                {/* POSIÇÃO */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold w-10 text-center">
                    {index + 1}
                  </span>

                  {/* FOTO */}
                  <Image
                    src={player.image}
                    alt={player.name}
                    width={48}
                    height={48}
                    className="rounded-full border"
                  />

                  <div>
                    <p className="font-semibold">
                      {player.name}{" "}
                      {isYou && (
                        <span className="text-primary text-sm">(Você)</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Nível {player.level} — {player.xp} XP
                    </p>
                  </div>
                </div>

                {/* MEDALHAS */}
                {index + 1 <= 3 && (
                  <span className="text-3xl">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
