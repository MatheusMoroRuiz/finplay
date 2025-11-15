// A pasta (home) entre parênteses indica que essa é a rota raiz do aplicativo. Pois quando o Next.js encontra uma pasta com parênteses, ele não usa como rota na URL, usa o nome do arquivo que está dentro dela.
// O arquivo page.tsx dentro dessa pasta define o componente que será renderizado quando o usuário acessar a rota raiz do aplicativo.

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/get-dashboard/can-user-add-transaction";

interface HomeProps {
  searchParams: {
    month: string;
  };
}
// Uma função assíncrona serve para lidar com operações que podem levar algum tempo, como chamadas de API ou consultas ao banco de dados.
// Neste caso, estamos usando auth() para verificar se o usuário está autenticado.
const Home = async ({ searchParams: { month } }: HomeProps) => {
  // Verifica se o usuário está autenticado
  // Se não estiver autenticado, redireciona para a página de login
  // A função auth() retorna um objeto com informações do usuário autenticado
  // O userId é uma propriedade que indica se o usuário está autenticado
  // Se userId for undefined, significa que o usuário não está autenticado
  // Portanto, redirecionamos para a página de login
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const monthIsInvalid = !month || !isMatch(month, "MM");
  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`);
  }
  const dashboard = await getDashboard(month);
  const userCanAddTransaction = await canUserAddTransaction();
  return (
    <>
      <Navbar />
      <div className=" flex flex-col overflow-hidden p-6 space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>
        <div className="grid grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            {/* Componente que exibe os cards de resumo financeiro */}
            <SummaryCards
              month={month}
              investmentsTotal={
                dashboard.investmentsTotal
                  ? Number(dashboard.investmentsTotal)
                  : 0
              }
              expensesTotal={
                dashboard.expensesTotal ? Number(dashboard.expensesTotal) : 0
              }
              depositsTotal={
                dashboard.depositsTotal ? Number(dashboard.depositsTotal) : 0
              }
              balance={dashboard.balance}
              userCanAddTransaction={userCanAddTransaction}
            />

            <div className="grid grid-cols-3 grid-rows-1 gap-6">
              <TransactionsPieChart
                investmentsTotal={
                  dashboard.investmentsTotal
                    ? Number(dashboard.investmentsTotal)
                    : 0
                }
                expensesTotal={
                  dashboard.expensesTotal ? Number(dashboard.expensesTotal) : 0
                }
                depositsTotal={
                  dashboard.depositsTotal ? Number(dashboard.depositsTotal) : 0
                }
              />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Home;
