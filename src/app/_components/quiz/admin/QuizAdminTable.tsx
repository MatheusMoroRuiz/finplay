"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import CreateQuestionDialog from "./dialogs/CreateQuestionDialog";
import EditQuestionDialog from "./dialogs/EditQuestionDialog";
import DeleteQuestionDialog from "./dialogs/DeleteQuestionDialog";

export default function QuizAdminTable({ questions }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [deleteQuestion, setDeleteQuestion] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Perguntas cadastradas</h2>
        <Button onClick={() => setCreateOpen(true)}>+ Criar Pergunta</Button>
      </div>

      <div className="grid gap-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="border p-4 rounded-xl bg-card shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{q.question}</p>
              <p className="text-sm text-muted-foreground">
                A) {q.optionA}
                <br />
                B) {q.optionB}
                <br />
                C) {q.optionC}
              </p>
              <p className="text-sm mt-1">
                <strong>Correta:</strong>{" "}
                <span className="text-green-500">{q.correct}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditQuestion(q)}>
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteQuestion(q)}
              >
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <CreateQuestionDialog open={createOpen} setOpen={setCreateOpen} />

      {editQuestion && (
        <EditQuestionDialog
          question={editQuestion}
          open={!!editQuestion}
          setOpen={() => setEditQuestion(null)}
        />
      )}

      {deleteQuestion && (
        <DeleteQuestionDialog
          question={deleteQuestion}
          open={!!deleteQuestion}
          setOpen={() => setDeleteQuestion(null)}
        />
      )}
    </div>
  );
}
