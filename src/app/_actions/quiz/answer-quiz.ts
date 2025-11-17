"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { xpForNextLevel } from "@/app/_utils/leveling";

export async function answerQuiz(questionId: string, chosen: "A" | "B" | "C") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 🔥 BLOQUEIO 100% REAL — verifica antes de tudo
  const already = await db.quizAnswer.findFirst({
    where: { userId, questionId },
  });

  if (already) {
    return {
      correct: already.correct,
      alreadyAnswered: true,
      message: "Você já respondeu esta pergunta.",
    };
  }

  // pegar pergunta
  const question = await db.quizQuestion.findUnique({
    where: { id: questionId },
  });

  if (!question) throw new Error("Pergunta não encontrada");

  const correct = chosen === question.correct;

  // salvar resposta
  await db.quizAnswer.create({
    data: {
      userId,
      questionId,
      chosen,
      correct,
    },
  });

  // XP apenas se acertou
  if (correct) {
    const XP_GAIN = 10;

    let xp = await db.userXp.findUnique({ where: { userId } });
    if (!xp) {
      xp = await db.userXp.create({
        data: { userId, xp: 0, level: 1 },
      });
    }

    let newXp = xp.xp + XP_GAIN;
    let newLevel = xp.level;
    let required = xpForNextLevel(newLevel);

    while (newXp >= required) {
      newXp -= required;
      newLevel++;
      required = xpForNextLevel(newLevel);
    }

    await db.userXp.update({
      where: { userId },
      data: { xp: newXp, level: newLevel },
    });
  }

  return {
    correct,
    alreadyAnswered: false,
    message: correct ? "Você acertou!" : "Você errou.",
  };
}
