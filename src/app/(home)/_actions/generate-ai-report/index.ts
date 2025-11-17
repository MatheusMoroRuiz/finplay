"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import OpenAI from "openai";
import {
  GenerateAiReportSchema,
  generateAiReportSchema,
} from "@/app/(home)/_actions/generate-ai-report/schema";

const DUMMY_REPORT =
  "### Relatório de Finanças Pessoais\n\n#### Resumo Geral das Finanças\nAs transações listadas foram analisadas e as seguintes informações foram extraídas para oferecer insights sobre suas finanças:\n\n- **Total de despesas:** R$ 19.497,56\n- **Total de investimentos:** R$ 14.141,47\n- **Total de depósitos/correntes:** R$ 10.100,00\n\n...";

export const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({ month });

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // validar plano premium
  const user = await clerkClient().users.getUser(userId);
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
  if (!hasPremiumPlan) {
    throw new Error("You need a premium plan to generate AI reports");
  }

  // fallback offline
  if (!process.env.OPENAI_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return DUMMY_REPORT;
  }

  const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // ✅ FILTRAR APENAS AS TRANSAÇÕES DO USUÁRIO LOGADO
  const transactions = await db.transaction.findMany({
    where: {
      userId, // <<<<<<<<<<<<<< AQUI ESTÁ A CORREÇÃO
      date: {
        gte: new Date(`2025-${month}-01`),
        lt: new Date(`2025-${month}-31`),
      },
    },
  });

  const content = `
Gere um relatório com insights sobre as minhas finanças,
com dicas e orientações de como melhorar minha vida financeira.

As transações estão divididas por ponto e vírgula.
A estrutura é: {DATA}-{VALOR}-{TIPO}-{CATEGORIA}

Transações do usuário:
${transactions
  .map(
    (t) =>
      `${t.date.toLocaleDateString("pt-BR")}-R$${t.amount}-${t.type}-${
        t.category
      }`
  )
  .join(";")}
`;

  const completion = await openAi.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanças pessoais.",
      },
      {
        role: "user",
        content,
      },
    ],
  });

  return completion.choices[0].message.content;
};
