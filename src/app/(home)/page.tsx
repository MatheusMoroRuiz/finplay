// A pasta (home) entre parênteses indica que essa é a rota raiz do aplicativo. Pois quando o Next.js encontra uma pasta com parênteses, ele não usa como rota na URL, usa o nome do arquivo que está dentro dela.
// O arquivo page.tsx dentro dessa pasta define o componente que será renderizado quando o usuário acessar a rota raiz do aplicativo.

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";

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
    redirect("?month=01");
  }
  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>
        {/* Componente que exibe os cards de resumo financeiro */}
        <SummaryCards month={month} />
      </div>
    </>
  );
};

export default Home;
