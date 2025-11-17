import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/_lib/prisma";

export default async function QuizHistorico() {
  const { userId } = await auth();

  const history = await db.quizUserAnswer.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { question: true },
  });

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Histórico do Quiz</h1>

      {history.map((h) => (
        <div key={h.id} className="p-4 border rounded-lg bg-card shadow">
          <p className="font-semibold">{h.question.question}</p>
          <p className="text-sm mt-1">
            Sua resposta: {h.answer} —
            {h.isCorrect ? (
              <span className="text-green-500">Correto</span>
            ) : (
              <span className="text-red-500">Errado</span>
            )}
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            Respondido em {new Date(h.createdAt).toLocaleString("pt-BR")}
          </p>
        </div>
      ))}
    </div>
  );
}
