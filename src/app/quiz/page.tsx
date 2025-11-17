import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { db } from "../_lib/prisma";
import QuizCard from "../_components/quiz/QuizCard";

export default async function QuizPage() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // respostas de hoje
  const answersToday = await db.quizAnswer.findMany({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  const limit = 2;
  const remaining = limit - answersToday.length;

  if (remaining <= 0) {
    return (
      <>
        <Navbar />

        <div className="p-10 max-w-xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Quiz do Dia</h1>
          <p className="text-muted-foreground">
            Você já respondeu todas as perguntas de hoje! Volte amanhã para
            ganhar mais XP.
          </p>
        </div>
      </>
    );
  }

  // pegar perguntas que o usuário ainda não respondeu
  const answeredIds = answersToday.map((a) => a.questionId);

  const question = await db.quizQuestion.findFirst({
    where: {
      id: { notIn: answeredIds },
    },
  });

  if (!question) {
    return (
      <>
        <Navbar />
        <div className="p-10 max-w-xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Quiz do Dia</h1>
          <p className="text-muted-foreground">
            Não há mais perguntas disponíveis. Adicione novas perguntas no
            painel admin.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="p-10 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Quiz do Dia</h1>

        <QuizCard question={question} remaining={remaining} />
      </div>
    </>
  );
}
