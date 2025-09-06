import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const TransactionsPage = async () => {
  // Verifica se o usuário está autenticado usando Clerk e redireciona para a página de login se não estiver
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  // O findMany serve para buscar todas as transações no banco na tabela Transaction
  const transactions = await db.transaction.findMany({
    where: {
      userId: userId, // Filtra as transações pelo ID do usuário autenticado
    },
    orderBy: {
      date: "desc", // Ordena as transações pela data em ordem decrescente
    },
  });
  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        {/* TÍTULO E BOTÃO */}
        <div className="flex w-full justify-between items-center">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton />
        </div>
        {/* Aqui eu estou renderizando a tabela de transações */}
        <DataTable columns={transactionColumns} data={transactions} />
      </div>
    </>
  );
};

export default TransactionsPage;
