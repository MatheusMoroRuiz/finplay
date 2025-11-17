import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/app/_lib/prisma";
import Navbar from "../_components/navbar";
import { xpForNextLevel } from "@/app/_utils/leveling";
import Image from "next/image";
import AchievementList from "../_components/AchievementList";

export default async function ProfilePage({ searchParams }: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Dados do usuário do Clerk
  const user = await currentUser();
  const userImage = user?.imageUrl || "";
  const userName = user?.firstName || user?.username || "Usuário";

  // Buscar USER XP (tabela correta)
  let profile = await db.userXp.findUnique({
    where: { userId },
  });

  // Se não existir, cria com XP inicial
  if (!profile) {
    profile = await db.userXp.create({
      data: {
        userId,
        xp: 0,
        level: 1,
      },
    });
  }

  // Cálculo de level
  const xpNeeded = xpForNextLevel(profile.level);
  const percent = Math.min(100, (profile.xp / xpNeeded) * 100);

  // ====================
  // PAGINAÇÃO
  // ====================
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

      <div className="p-10 max-w-4xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="flex items-center gap-6">
          <Image
            src={userImage}
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full border border-primary object-cover"
          />

          <div>
            <h1 className="text-3xl font-bold">{userName}</h1>
            <p className="text-muted-foreground">Perfil do Jogador</p>
          </div>
        </div>

        {/* LEVEL CARD */}
        <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Nível {profile.level}</h2>
            <span className="text-muted-foreground">
              XP Total: {profile.xp}
            </span>
          </div>

          {/* Barra de XP */}
          <div className="w-full h-3 bg-muted rounded-lg overflow-hidden">
            <div
              className="h-full bg-primary xp-animated"
              style={{ width: `${percent}%` }}
            ></div>
          </div>

          <p className="text-sm text-muted-foreground">
            {profile.xp} / {xpNeeded} XP para o próximo nível
          </p>
        </div>

        {/* LISTA DE CONQUISTAS PAGINADA */}
        <AchievementList
          achievements={achievements}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
