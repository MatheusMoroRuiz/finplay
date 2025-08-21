import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="grid h-full grid-cols-2">
      {/* CONTEÚDO DA ESQUERDA */}
      {/* O max-w-[500px] serve para limitar a largura máxima do conteúdo */}
      {/* O mx-auto serve para centralizar o conteúdo horizontalmente */}
      <div className="flex flex-col h-full justify-center p-8 max-w-[550px] mx-auto">
        <Image
          src="/logotipo.svg"
          width={173}
          height={39}
          alt="FinPlay"
          className="mb-8"
        />
        <h1 className="text-4xl font-bold mb-3">Bem-vindo</h1>
        <p className="text-muted-foreground mb-8 text-justify">
          O FinPlay é um site de gestão financeira inteligente que combina IA e
          gamificação para transformar a maneira como você cuida do seu
          dinheiro. Mais do que controlar gastos, nós tornamos a educação
          financeira uma experiência prática, divertida e segura.
        </p>
        <Button variant="outline">
          <LogInIcon className="mr-2" />
          Fazer login ou criar conta
        </Button>
      </div>
      {/* IMAGEM DA DIREITA */}
      <div className="relative h-full w-ful">
        {/* Criei essa outra div para colocar o h-full e w-full, que irá preencher a largura e altura 100% */}
        {/* O fill serve para que a imagem preencha o espaço da div pai */}
        {/* A classe object-cover faz com que a imagem cubra todo o espaço disponível, mantendo a proporção */}
        <Image
          src="/imagem-login.png"
          alt="Login Background"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
