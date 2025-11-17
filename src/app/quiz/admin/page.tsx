import Navbar from "@/app/_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/app/_utils/isAdmin";
import { db } from "@/app/_lib/prisma";
import QuizAdminTable from "@/app/_components/quiz/admin/QuizAdminTable";
import { redirect } from "next/navigation";

export default async function QuizAdminPage() {
  const { userId } = await auth();

  // 🔥 Nunca use throw em Server Components na Vercel
  if (!userId) {
    redirect("/login");
  }

  // 🔥 Proteção real de administrador
  const admin = await isAdmin();
  if (!admin) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold">Acesso negado</h1>
          <p className="text-muted-foreground mt-2">
            Esta área é restrita a administradores.
          </p>
        </div>
      </>
    );
  }

  // 🔥 Consulta corrigida (seu model NÃO tem quizAnswers)
  const questions = await db.quizQuestion.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />

      <div className="p-10 max-w-3xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold">Admin — Quiz</h1>

        <QuizAdminTable questions={questions} />
      </div>
    </>
  );
}
