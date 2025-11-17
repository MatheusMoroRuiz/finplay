"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createQuizQuestion(data) {
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // +30min
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.quizQuestion.create({
    data: {
      question: data.question,
      optionA: data.optionA,
      optionB: data.optionB,
      optionC: data.optionC,
      correct: data.correct,
      expiresAt,
    },
  });

  revalidatePath("/admin/quiz");
}
