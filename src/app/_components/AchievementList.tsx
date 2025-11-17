"use client";

import Link from "next/link";

export default function AchievementList({ achievements, page, totalPages }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Conquistas</h2>

      {achievements.length === 0 && (
        <p className="text-muted-foreground">Nenhuma conquista encontrada.</p>
      )}

      {achievements.map((ach) => (
        <div
          key={ach.id}
          className="p-4 border rounded-xl bg-card shadow-sm flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 text-3xl">🏅</span>

            <div>
              <h3 className="font-semibold">{ach.title}</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(ach.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          <span className="text-primary font-semibold">+{ach.points} XP</span>
        </div>
      ))}

      {/* PAGINAÇÃO */}
      <div className="flex justify-center gap-2 mt-6">
        {/* Botão voltar */}
        {page > 1 && (
          <Link
            href={`?page=${page - 1}`}
            className="px-3 py-1 border rounded-lg hover:bg-muted"
          >
            ←
          </Link>
        )}

        {/* Botões numéricos */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const num = i + 1;
          return (
            <Link
              key={num}
              href={`?page=${num}`}
              className={`px-3 py-1 border rounded-lg ${
                num === page ? "bg-primary text-white" : "hover:bg-muted"
              }`}
            >
              {num}
            </Link>
          );
        })}

        {/* Botão próximo */}
        {page < totalPages && (
          <Link
            href={`?page=${page + 1}`}
            className="px-3 py-1 border rounded-lg hover:bg-muted"
          >
            →
          </Link>
        )}
      </div>
    </div>
  );
}
