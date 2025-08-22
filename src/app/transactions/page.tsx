import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "../_components/ui/button";
import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";

const TransactionsPage = async () => {
  // O findMany serve para buscar todas as transações no banco na tabela Transaction
  const transactions = await db.transaction.findMany({});
  return (
    <div className="p-6 space-y-6">
      {/* TÍTULO E BOTÃO */}
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Button className="rounded-full">
          Adicionar Transação
          <ArrowDownUpIcon />
        </Button>
      </div>
      {/* Aqui eu estou renderizando a tabela de transações */}
      <DataTable columns={transactionColumns} data={transactions} />
    </div>
  );
};

export default TransactionsPage;
