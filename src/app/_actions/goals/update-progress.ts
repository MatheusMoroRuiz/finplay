"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { xpForNextLevel } from "@/app/_utils/leveling"; // ✅ IMPORT NECESSÁRIO

export async function updateGoalProgress(goalId: string, newValue: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1) Atualiza o progresso
  await db.goal.update({
    where: { id: goalId },
    data: { current: newValue },
  });

  // 2) Busca o goal atualizado
  const goal = await db.goal.findUnique({
    where: { id: goalId },
  });

  if (!goal) return { success: false };

  // 3) Verifica se a meta foi concluída
  if (goal.current >= goal.amount) {
    const XP_GAIN = 15;

    // Busca registro XP do usuário
    let userXp = await db.userXp.findUnique({
      where: { userId },
    });

    // Se não existir, cria
    if (!userXp) {
      userXp = await db.userXp.create({
        data: {
          userId,
          xp: 0,
          level: 1,
        },
      });
    }

    // ---- SISTEMA DE XP + LEVELING ----
    let newXp = userXp.xp + XP_GAIN;
    let newLevel = userXp.level;
    let requiredXp = xpForNextLevel(userXp.level);

    while (newXp >= requiredXp) {
      newXp -= requiredXp;
      newLevel++;
      requiredXp = xpForNextLevel(newLevel);
    }

    await db.userXp.update({
      where: { userId },
      data: {
        xp: newXp,
        level: newLevel,
      },
    });

    // ---- CRIAR CONQUISTA ----
    await db.achievement.create({
      data: {
        userId,
        goalId: goal.id,
        title: `Meta concluída: ${goal.title}`,
        icon: "medal",
        points: XP_GAIN,
      },
    });
  }

  revalidatePath("/goals");
  return { success: true };
}
