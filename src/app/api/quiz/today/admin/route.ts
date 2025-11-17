import { db } from "@/app/_lib/prisma";

export async function POST(req: Request) {
  const data = await req.formData();

  await db.quizQuestion.create({
    data: {
      question: data.get("question")!.toString(),
      optionA: data.get("optionA")!.toString(),
      optionB: data.get("optionB")!.toString(),
      optionC: data.get("optionC")!.toString(),
      correct: data.get("correct")!.toString(),
    },
  });

  return Response.json({ success: true });
}
