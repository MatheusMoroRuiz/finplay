"use server";

import { db } from "@/app/_lib/prisma";

export async function getXpRanking(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const users = await db.userProfile.findMany({
    orderBy: { totalXp: "desc" },
    skip,
    take: limit,
  });

  const total = await db.userProfile.count();

  return { users, total };
}

export async function getQuizRanking(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const users = await db.quizAnswer.groupBy({
    by: ["userId"],
    _count: {
      correct: true,
    },
    where: {
      correct: true,
    },
    orderBy: {
      _count: { correct: "desc" },
    },
    skip,
    take: limit,
  });

  const total = await db.quizAnswer.groupBy({
    by: ["userId"],
    _count: { correct: true },
    where: { correct: true },
  });

  // buscar perfis
  const usersWithProfile = await Promise.all(
    users.map(async (u) => {
      const profile = await db.userProfile.findUnique({
        where: { userId: u.userId },
      });

      return {
        userId: u.userId,
        name: profile?.name || "Usuário",
        xp: profile?.totalXp || 0,
        correctAnswers: u._count.correct,
      };
    })
  );

  return { users: usersWithProfile, total: total.length };
}
