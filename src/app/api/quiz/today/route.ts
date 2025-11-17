import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/_lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const answersToday = await db.quizUserAnswer.findMany({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  // Já respondeu 2 hoje → retornar as próprias perguntas
  if (answersToday.length >= 2) {
    const ids = answersToday.map((a) => a.questionId);

    const questions = await db.quizQuestion.findMany({
      where: { id: { in: ids } },
    });

    return Response.json(questions);
  }

  // Selecionar perguntas novas que o usuário nunca respondeu
  const pastAnswers = await db.quizUserAnswer.findMany({
    where: { userId },
    select: { questionId: true },
  });

  const usedIds = pastAnswers.map((p) => p.questionId);

  const available = await db.quizQuestion.findMany({
    where: { id: { notIn: usedIds } },
  });

  const shuffled = available.sort(() => Math.random() - 0.5);
  const toSend = shuffled.slice(0, 2 - answersToday.length);

  return Response.json(toSend);
}
