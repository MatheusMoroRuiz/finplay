"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { upsertGoalSchema, UpsertGoalSchema } from "./schema";

export async function upsertGoal(data: UpsertGoalSchema) {
  const parsed = upsertGoalSchema.parse(data);

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // SE TIVER ID → UPDATE
  if (parsed.id) {
    await db.goal.update({
      where: { id: parsed.id },
      data: {
        title: parsed.title,
        description: parsed.description,
        amount: parsed.amount,
        deadline: parsed.deadline ?? null,
        // current nunca é atualizado aqui!
        userId,
      },
    });

    revalidatePath("/goals");
    return;
  }

  // SE NÃO → CREATE
  await db.goal.create({
    data: {
      userId,
      title: parsed.title,
      description: parsed.description,
      amount: parsed.amount,
      deadline: parsed.deadline ?? null,
      current: 0, // segurança extra
    },
  });

  revalidatePath("/goals");
}
