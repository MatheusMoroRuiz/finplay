"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createAchievement(data: {
  goalId?: string;
  title: string;
  icon: string;
  points?: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.achievement.create({
    data: {
      userId,
      goalId: data.goalId,
      title: data.title,
      icon: data.icon,
      points: data.points ?? 50,
    },
  });

  revalidatePath("/achievements");
}
