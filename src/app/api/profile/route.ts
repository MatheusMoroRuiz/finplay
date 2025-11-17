import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/_lib/prisma";
import { xpForNextLevel } from "@/app/_utils/leveling";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Buscar XP na tabela CORRETA
  const profile = await db.userXp.findUnique({
    where: { userId },
  });

  // Se não existir → cria com valores iniciais
  if (!profile) {
    const newProfile = await db.userXp.create({
      data: {
        userId,
        xp: 0,
        level: 1,
      },
    });

    return Response.json({
      xp: newProfile.xp,
      level: newProfile.level,
      xpForNext: xpForNextLevel(newProfile.level),
    });
  }

  // Retorno oficial
  return Response.json({
    xp: profile.xp,
    level: profile.level,
    xpForNext: xpForNextLevel(profile.level),
  });
}
