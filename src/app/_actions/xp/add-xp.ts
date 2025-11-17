"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { shouldLevelUp, xpForNextLevel } from "@/app/_utils/leveling";
import { revalidatePath } from "next/cache";

export async function addXp(amount: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const profile = await db.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) throw new Error("Profile not found");

  let xp = profile.xp + amount;
  let totalXp = profile.totalXp + amount;
  let level = profile.level;

  // Sistema de Level Up (loop caso passe de múltiplos níveis)
  while (shouldLevelUp(xp, level)) {
    xp -= xpForNextLevel(level);
    level++;
  }

  const updated = await db.userProfile.update({
    where: { userId },
    data: {
      xp,
      level,
      totalXp,
    },
  });

  await db.userProfile.update({
    where: { userId },
    data: {
      xp,
      level,
      totalXp,
    },
  });

  revalidatePath("/api/profile");
  return updated;
}
