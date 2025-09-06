import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "./_components/navbar";

// Uma função assíncrona serve para lidar com operações que podem levar algum tempo, como chamadas de API ou consultas ao banco de dados.
// Neste caso, estamos usando auth() para verificar se o usuário está autenticado.
const Home = async () => {
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
  return (
    <>
      <Navbar />
      <div className="flex h-full items-center justify-center"></div>
    </>
  );
};

export default Home;
