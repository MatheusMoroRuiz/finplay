"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { addTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface AddTransactionParams {
  name: string;
  amount: string;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const addTransaction = async (
  //O Omit serve para remover a propriedade "userId" do tipo Prisma.TransactionCreateInput
  params: AddTransactionParams
) => {
  //O  addTransactionSchema.parse(params) serve para validar os dados da transação e caso falhe retorna um erro
  addTransactionSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }
  // Lógica para adicionar a transação usando o Prisma
  await db.transaction.create({
    data: { ...params, userId },
  });
  revalidatePath("/transactions");
};
