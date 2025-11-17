"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlayerStats } from "@/app/_hooks/usePlayerStats";

const Navbar = () => {
  const pathname = usePathname();
  const stats = usePlayerStats();

  const xpPercent = stats
    ? Math.min(100, (stats.xp / stats.xpForNext) * 100)
    : 0;

  // Helper de rota ativa
  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(route + "/");

  return (
    <nav className="flex justify-between px-8 py-4 border-b border-solid items-center">
      {/* ESQUERDA */}
      <div className="flex items-center gap-10">
        <Image src="/logotipo.svg" alt="FinPlay" width={173} height={39} />

        <Link
          href="/"
          className={
            isActive("/") ? "text-primary font-bold" : "text-muted-foreground"
          }
        >
          Dashboard
        </Link>

        <Link
          href="/transactions"
          className={
            isActive("/transactions")
              ? "text-primary font-bold"
              : "text-muted-foreground"
          }
        >
          Transações
        </Link>

        <Link
          href="/goals"
          className={
            isActive("/goals")
              ? "text-primary font-bold"
              : "text-muted-foreground"
          }
        >
          Metas
        </Link>

        <Link
          href="/achievements"
          className={
            isActive("/achievements")
              ? "text-primary font-bold"
              : "text-muted-foreground"
          }
        >
          Conquistas
        </Link>

        <Link
          href="/ranking"
          className={
            isActive("/ranking")
              ? "text-primary font-bold"
              : "text-muted-foreground"
          }
        >
          Ranking
        </Link>

        {/* 🔥 NOVO BOTÃO QUIZ */}
        <Link
          href="/quiz"
          className={
            isActive("/quiz")
              ? "text-primary font-bold"
              : "text-muted-foreground"
          }
        >
          Quiz
        </Link>

        <Link
          href="/subscription"
          className={
            isActive("/subscription")
              ? "text-primary font-bold"
              : "text-muted-foreground"
          }
        >
          Assinatura
        </Link>
      </div>

      {/* DIREITA */}
      <div className="flex items-center gap-6">
        {/* XP + Level */}
        {stats && (
          <Link href="/profile" className="flex flex-col items-end group">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Nível {stats.level}
              </span>
            </div>

            {/* Barra de XP */}
            <div className="w-40 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary xp-animated"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>

            <span className="text-xs text-muted-foreground">
              XP {stats.xp}/{stats.xpForNext}
            </span>
          </Link>
        )}

        <UserButton showName />
      </div>
    </nav>
  );
};

export default Navbar;
