"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createQuizQuestion(values) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.quizQuestion.create({
    data: {
      question: values.question,
      optionA: values.optionA,
      optionB: values.optionB,
      optionC: values.optionC,
      correct: values.correct,
    },
  });

  revalidatePath("/admin/quiz");
}
