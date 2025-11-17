import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { db } from "../_lib/prisma";
import QuizCard from "../_components/quiz/QuizCard";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "../_components/ui/button";

export default async function QuizPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const now = new Date();

  const question = await db.quizQuestion.findFirst({
    where: {
      expiresAt: { gt: now },
      quizAnswers: {
        none: { userId },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />

      <div className="p-10 max-w-xl mx-auto">
        {/* HEADER MODERNO */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Quiz</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Teste seus conhecimentos e ganhe XP!
            </p>
          </div>

          <Link href="/quiz/historico">
            <Button
              variant="outline"
              className="
                border-primary/20 
                hover:bg-primary/10 
                transition 
                text-primary
                rounded-lg
              "
            >
              📘 Histórico
            </Button>
          </Link>
        </div>

        {/* CONTEÚDO */}
        {!question ? (
          <div className="text-center p-10 bg-card border border-muted rounded-xl shadow-sm">
            <p className="text-muted-foreground text-lg">
              Nenhuma pergunta ativa no momento.
              <br />
              <span className="text-primary font-medium">
                Aguarde o próximo lançamento! ⏳
              </span>
            </p>
          </div>
        ) : (
          <QuizCard question={question} />
        )}
      </div>
    </>
  );
}
