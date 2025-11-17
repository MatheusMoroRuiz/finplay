import Navbar from "@/app/_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/_lib/prisma";

export default async function QuizHistoricoPage() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const history = await db.quizAnswer.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      question: true, // <-- isso SÓ funciona se você adicionou a relação no schema
    },
  });

  return (
    <>
      <Navbar />
      <div className="p-10 max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Histórico do Quiz</h1>

        {history.length === 0 && (
          <p className="text-muted-foreground">Nenhuma resposta ainda.</p>
        )}

        <div className="space-y-4">
          {history.map((h) => (
            <div
              key={h.id}
              className="p-4 border rounded-xl bg-card shadow-sm flex flex-col gap-2"
            >
              <p className="font-medium">{h.question?.question}</p>

              <p
                className={
                  h.correct
                    ? "text-green-500 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                {h.correct ? "✔ Você acertou" : "✖ Você errou"}
              </p>

              <span className="text-xs text-muted-foreground">
                {new Date(h.createdAt).toLocaleString("pt-BR")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
