import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/_lib/prisma";
import AchievementCard from "@/app/_components/achievements/achievement-card";
import Navbar from "@/app/_components/navbar";
import Link from "next/link";

export default async function AchievementsPage({ searchParams }: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // ===== PAGINAÇÃO =====
  const page = Number(searchParams?.page) || 1;
  const perPage = 5;

  const achievements = await db.achievement.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const total = await db.achievement.count({ where: { userId } });
  const totalPages = Math.ceil(total / perPage);

  return (
    <>
      <Navbar />

      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Minhas Conquistas</h1>

        {!achievements.length && (
          <p className="text-muted-foreground">
            Nenhuma conquista ainda. Conclua metas para desbloquear medalhas!
          </p>
        )}

        {/* LISTA PAGINADA */}
        <div className="space-y-4">
          {achievements.map((a) => (
            <AchievementCard
              key={a.id}
              title={a.title}
              icon={a.icon}
              points={a.points}
              date={a.createdAt}
            />
          ))}
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {/* ← ANTERIOR */}
            {page > 1 && (
              <Link
                href={`?page=${page - 1}`}
                className="px-3 py-1 border rounded-lg hover:bg-muted"
              >
                ←
              </Link>
            )}

            {/* NÚMEROS */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const num = i + 1;
              return (
                <Link
                  key={num}
                  href={`?page=${num}`}
                  className={`px-3 py-1 border rounded-lg ${
                    num === page ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
                >
                  {num}
                </Link>
              );
            })}

            {/* → PRÓXIMO */}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}`}
                className="px-3 py-1 border rounded-lg hover:bg-muted"
              >
                →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
