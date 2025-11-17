"use client";

import { Goal } from "@prisma/client";
import { Button } from "../ui/button";
import { Pencil, Trash, TrendingUp, CheckCircle } from "lucide-react";
import { useState } from "react";
import UpsertGoalDialog from "./upsert-goal-dialog";
import UpdateGoalProgressDialog from "./update-goal-progress-dialog";
import DeleteGoalDialog from "./delete-goal-dialog";
import GoalCompletedModal from "./goal-completed-modal";
import { createAchievement } from "@/app/_actions/achievements/create-achievement";

export default function GoalsList({ goals }: { goals: Goal[] }) {
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [progressGoal, setProgressGoal] = useState<Goal | null>(null);
  const [deleteGoalState, setDeleteGoalState] = useState<Goal | null>(null);
  const [completedGoal, setCompletedGoal] = useState<Goal | null>(null);

  const activeGoals = goals.filter((g) => g.current < g.amount);
  const completedGoals = goals.filter((g) => g.current >= g.amount);

  // PAGINAÇÃO
  const perPage = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(completedGoals.length / perPage);
  const paginatedCompleted = completedGoals.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <>
      {/* METAS ATIVAS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Metas em andamento</h2>

        {!activeGoals.length && (
          <p className="text-muted-foreground text-sm">Nenhuma meta ativa.</p>
        )}

        <div className="grid gap-6">
          {activeGoals.map((goal) => {
            const progress = Math.min((goal.current / goal.amount) * 100, 100);

            return (
              <div
                key={goal.id}
                className="
                  p-6 rounded-xl border border-neutral-800 
                  bg-neutral-900/40 backdrop-blur-sm
                  shadow-sm hover:shadow-md transition-shadow
                  space-y-4
                "
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xl">{goal.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {goal.deadline
                      ? new Date(goal.deadline).toLocaleDateString("pt-BR")
                      : "Sem prazo"}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {goal.description}
                </p>

                <div className="flex justify-between text-sm">
                  <span>
                    Meta:{" "}
                    <span className="text-primary font-medium">
                      R$ {goal.amount.toLocaleString("pt-BR")}
                    </span>
                  </span>

                  <span>
                    Atual:{" "}
                    <span className="text-green-500 font-medium">
                      R$ {goal.current.toLocaleString("pt-BR")}
                    </span>
                  </span>
                </div>

                <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-right text-xs text-muted-foreground">
                  {progress.toFixed(0)}% concluído
                </p>

                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditGoal(goal)}
                  >
                    <Pencil size={16} /> Editar Meta
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProgressGoal(goal)}
                  >
                    <TrendingUp size={16} /> Editar Progresso
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteGoalState(goal)}
                  >
                    <Trash size={16} /> Excluir
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* METAS CONCLUÍDAS */}
      <div className="space-y-6 mt-12">
        {completedGoals.length > 0 && (
          <h2 className="text-2xl font-bold">🏁 Metas concluídas</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedCompleted.map((goal) => (
            <div
              key={goal.id}
              className="
                p-5 rounded-xl border border-green-700 
                bg-green-900/20 shadow-sm
                space-y-4
              "
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex gap-2 items-center">
                  <CheckCircle className="text-green-500" size={20} />
                  {goal.title}
                </h3>

                <span className="text-xs text-muted-foreground">
                  {new Date(goal.updatedAt).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>

              <span className="text-sm font-medium">
                Meta atingida: R$ {goal.amount.toLocaleString("pt-BR")}
              </span>

              <div className="flex justify-end pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteGoalState(goal)}
                >
                  <Trash size={16} /> Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="flex gap-2 justify-center mt-4">
            {page > 1 && (
              <button
                className="px-3 py-1 border rounded-lg hover:bg-muted"
                onClick={() => setPage(page - 1)}
              >
                ←
              </button>
            )}

            {Array.from({ length: totalPages }).map((_, i) => {
              const num = i + 1;
              return (
                <button
                  key={num}
                  className={`px-3 py-1 border rounded-lg ${
                    num === page ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              );
            })}

            {page < totalPages && (
              <button
                className="px-3 py-1 border rounded-lg hover:bg-muted"
                onClick={() => setPage(page + 1)}
              >
                →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dialogs */}
      {editGoal && (
        <UpsertGoalDialog
          isOpen={!!editGoal}
          setIsOpen={() => setEditGoal(null)}
          defaultValues={{
            id: editGoal.id,
            title: editGoal.title,
            amount: editGoal.amount,
            current: editGoal.current,
            description: editGoal.description,
            deadline: editGoal.deadline
              ? new Date(editGoal.deadline)
              : undefined,
          }}
        />
      )}

      {progressGoal && (
        <UpdateGoalProgressDialog
          isOpen={!!progressGoal}
          setIsOpen={() => setProgressGoal(null)}
          goalId={progressGoal.id}
          currentValue={progressGoal.current}
          goalAmount={progressGoal.amount}
          onCompleted={() => {
            setCompletedGoal(progressGoal);
          }}
        />
      )}

      {deleteGoalState && (
        <DeleteGoalDialog
          isOpen={!!deleteGoalState}
          setIsOpen={() => setDeleteGoalState(null)}
          goalId={deleteGoalState.id}
        />
      )}

      {completedGoal && (
        <GoalCompletedModal
          goal={completedGoal}
          onClose={() => setCompletedGoal(null)}
        />
      )}
    </>
  );
}
