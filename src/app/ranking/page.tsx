import Navbar from "../_components/navbar";
import { db } from "../_lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function RankingPage({ searchParams }) {
  const loggedUser = await currentUser();

  // ============================
  // PAGINAÇÃO GLOBAL
  // ============================
  const pageXp = Number(searchParams.pageXp || 1);
  const pageQuiz = Number(searchParams.pageQuiz || 1);
  const pageTx = Number(searchParams.pageTx || 1);

  const TAKE = 10;

  // =======================================================
  // RANKING XP
  // =======================================================

  const skipXp = (pageXp - 1) * TAKE;

  const xpUsers = await db.userXp.findMany({
    orderBy: [{ level: "desc" }, { xp: "desc" }],
  });

  const paginatedXp = xpUsers.slice(skipXp, skipXp + TAKE);
  const totalXpPages = Math.ceil(xpUsers.length / TAKE);

  const clerkXpUsers = await Promise.all(
    paginatedXp.map(async (u) => {
      const clerk = await fetch(`https://api.clerk.com/v1/users/${u.userId}`, {
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
        cache: "no-store",
      }).then((r) => r.json());

      return {
        ...u,
        image: clerk.image_url,
        name: clerk.first_name || clerk.username || "Jogador",
      };
    })
  );

  // =======================================================
  // RANKING QUIZ (acertos)
  // =======================================================

  const quizStats = await db.quizAnswer.groupBy({
    by: ["userId"],
    _count: { correct: true },
    where: { correct: true },
    orderBy: { _count: { correct: "desc" } },
  });

  const skipQuiz = (pageQuiz - 1) * TAKE;
  const paginatedQuiz = quizStats.slice(skipQuiz, skipQuiz + TAKE);
  const totalQuizPages = Math.ceil(quizStats.length / TAKE);

  const clerkQuizUsers = await Promise.all(
    paginatedQuiz.map(async (u) => {
      const clerk = await fetch(`https://api.clerk.com/v1/users/${u.userId}`, {
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
        cache: "no-store",
      }).then((r) => r.json());

      return {
        userId: u.userId,
        correct: u._count.correct,
        image: clerk.image_url,
        name: clerk.first_name || clerk.username || "Jogador",
      };
    })
  );

  // =======================================================
  // RANKING TRANSACOES
  // =======================================================

  const txStats = await db.transaction.groupBy({
    by: ["userId"],
    _count: { userId: true },
    orderBy: { _count: { userId: "desc" } },
  });

  const skipTx = (pageTx - 1) * TAKE;
  const paginatedTx = txStats.slice(skipTx, skipTx + TAKE);
  const totalTxPages = Math.ceil(txStats.length / TAKE);

  const clerkTxUsers = await Promise.all(
    paginatedTx.map(async (u) => {
      const clerk = await fetch(`https://api.clerk.com/v1/users/${u.userId}`, {
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
        cache: "no-store",
      }).then((r) => r.json());

      return {
        userId: u.userId,
        txCount: u._count.userId,
        image: clerk.image_url,
        name: clerk.first_name || clerk.username || "Jogador",
      };
    })
  );

  // PAGE COMPONENT
  return (
    <>
      <Navbar />

      <div className="p-10 max-w-7xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center">Ranking</h1>

        {/* 3 Rankings lado a lado */}
        <div className="grid grid-cols-3 gap-10">
          {/* ================================== */}
          {/* RANKING XP */}
          {/* ================================== */}
          <div>
            <h2 className="text-2xl font-bold mb-3">Ranking XP</h2>

            <div className="space-y-4">
              {clerkXpUsers.map((player, index) => {
                const position = skipXp + index + 1;
                const isYou = player.userId === loggedUser?.id;

                return (
                  <div
                    key={player.userId}
                    className={`flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm ${
                      isYou ? "border-primary bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-10 text-center">
                        {position}
                      </span>

                      <Image
                        src={player.image}
                        alt={player.name}
                        width={48}
                        height={48}
                        className="rounded-full border"
                      />

                      <div>
                        <p className="font-semibold">
                          {player.name}{" "}
                          {isYou && (
                            <span className="text-primary text-sm">(Você)</span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Nível {player.level} — {player.xp} XP
                        </p>
                      </div>
                    </div>

                    {position <= 3 && (
                      <span className="text-5xl">
                        {position === 1 && "🏆"}
                        {position === 2 && "🥈"}
                        {position === 3 && "🥉"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* PAGINAÇÃO XP */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalXpPages }).map((_, i) => (
                <a
                  key={i}
                  href={`/ranking?pageXp=${
                    i + 1
                  }&pageQuiz=${pageQuiz}&pageTx=${pageTx}`}
                  className={`px-3 py-1 rounded-md border ${
                    pageXp === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border-muted"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          </div>

          {/* ================================== */}
          {/* RANKING QUIZ */}
          {/* ================================== */}
          <div>
            <h2 className="text-2xl font-bold mb-3">Ranking Quiz (Acertos)</h2>

            <div className="space-y-4">
              {clerkQuizUsers.map((player, index) => {
                const position = skipQuiz + index + 1;
                const isYou = player.userId === loggedUser?.id;

                return (
                  <div
                    key={player.userId}
                    className={`flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm ${
                      isYou ? "border-primary bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-10 text-center">
                        {position}
                      </span>

                      <Image
                        src={player.image}
                        alt={player.name}
                        width={48}
                        height={48}
                        className="rounded-full border"
                      />

                      <div>
                        <p className="font-semibold">
                          {player.name}{" "}
                          {isYou && (
                            <span className="text-primary text-sm">(Você)</span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {player.correct} acertos
                        </p>
                      </div>
                    </div>

                    {position <= 3 && (
                      <span className="text-5xl">
                        {position === 1 && "🏆"}
                        {position === 2 && "🥈"}
                        {position === 3 && "🥉"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* PAGINAÇÃO QUIZ */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalQuizPages }).map((_, i) => (
                <a
                  key={i}
                  href={`/ranking?pageXp=${pageXp}&pageQuiz=${
                    i + 1
                  }&pageTx=${pageTx}`}
                  className={`px-3 py-1 rounded-md border ${
                    pageQuiz === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border-muted"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          </div>

          {/* ================================== */}
          {/* RANKING TRANSACOES */}
          {/* ================================== */}
          <div>
            <h2 className="text-2xl font-bold mb-3">Ranking Transações</h2>

            <div className="space-y-4">
              {clerkTxUsers.map((player, index) => {
                const position = skipTx + index + 1;
                const isYou = player.userId === loggedUser?.id;

                return (
                  <div
                    key={player.userId}
                    className={`flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm ${
                      isYou ? "border-primary bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-10 text-center">
                        {position}
                      </span>

                      <Image
                        src={player.image}
                        alt={player.name}
                        width={48}
                        height={48}
                        className="rounded-full border"
                      />

                      <div>
                        <p className="font-semibold">
                          {player.name}{" "}
                          {isYou && (
                            <span className="text-primary text-sm">(Você)</span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {player.txCount} transações
                        </p>
                      </div>
                    </div>

                    {position <= 3 && (
                      <span className="text-5xl">
                        {position === 1 && "🏆"}
                        {position === 2 && "🥈"}
                        {position === 3 && "🥉"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* PAGINAÇÃO TRANSAÇÕES */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalTxPages }).map((_, i) => (
                <a
                  key={i}
                  href={`/ranking?pageXp=${pageXp}&pageQuiz=${pageQuiz}&pageTx=${
                    i + 1
                  }`}
                  className={`px-3 py-1 rounded-md border ${
                    pageTx === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border-muted"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
