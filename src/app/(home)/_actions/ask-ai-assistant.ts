"use server";

import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";

export async function askAiAssistant({ userMessage, userName }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
Você é um Assistente Financeiro extremamente objetivo.
✨ Responda com uma frase curta, de no máximo 5 linhas.
✨ Máximo: 75 palavras.
✨ Proibido listas longas, tópicos, parágrafos longos ou textos grandes.
✨ Seja direto, útil e simples.
✨ Tom amigável, estilo Nubank.
`,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  return completion.choices[0].message.content;
}
