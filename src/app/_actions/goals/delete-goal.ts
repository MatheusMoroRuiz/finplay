"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteGoal(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.goal.delete({
    where: { id },
  });

  revalidatePath("/goals");
}
