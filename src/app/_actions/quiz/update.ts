"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateQuizQuestion(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.quizQuestion.update({
    where: { id: data.id },
    data: {
      question: data.question,
      optionA: data.optionA,
      optionB: data.optionB,
      optionC: data.optionC,
      correct: data.correct,
    },
  });

  revalidatePath("/quiz/admin");
}
