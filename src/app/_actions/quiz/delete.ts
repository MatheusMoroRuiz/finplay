"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteQuizQuestion(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.quizQuestion.delete({
    where: { id },
  });

  revalidatePath("/quiz/admin");
}
