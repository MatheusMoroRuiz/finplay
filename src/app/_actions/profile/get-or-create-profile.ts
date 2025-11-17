"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getOrCreateUserProfile() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let profile = await db.userProfile.findUnique({
    where: { userId },
  });

  // Se não existir → cria
  if (!profile) {
    profile = await db.userProfile.create({
      data: {
        userId,
        xp: 0,
        level: 1,
        totalXp: 0,
      },
    });
  }

  return profile;
}
