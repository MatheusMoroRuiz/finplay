"use client";

// Esse arquivo serve para criar as colunas da tabela de transações com seus respectivos cabeçalhos e tipos de dados

import { Transaction, TransactionType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/app/_components/ui/badge";
import { CircleIcon } from "lucide-react";

// A Transaction já possui os campos: id, name, type, category, paymentMethod, date, amount que puxa automaticamente do banco de dados
export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    // O cell serve para renderizar o conteúdo da célula, então eu consigo personalizar a exibição de acordo com o tipo de transação
    cell: ({ row: { original: transaction } }) => {
      if (transaction.type === TransactionType.DEPOSIT) {
        return (
          <Badge className="bg-muted text-primary hover:bg-muted font-bold">
            <CircleIcon className="mr-2 fill-primary" size={10} />
            Depósito
          </Badge>
        );
      }
      if (transaction.type === TransactionType.EXPENSE) {
        return (
          <Badge className="bg-muted text-destructive hover:bg-muted font-bold">
            <CircleIcon className="mr-2 fill-destructive" size={10} />
            Despesa
          </Badge>
        );
      }
      if (transaction.type === TransactionType.INVESTMENT) {
        return (
          <Badge className="bg-muted text-blue-600 hover:bg-muted">
            <CircleIcon className="mr-2 fill-blue-600" size={10} />
            Investimento
          </Badge>
        );
      }
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de Pagamento",
  },
  {
    accessorKey: "date",
    header: "Data",
  },
  {
    accessorKey: "amount",
    header: "Valor",
  },
  {
    accessorKey: "actions",
    header: "",
  },
];
