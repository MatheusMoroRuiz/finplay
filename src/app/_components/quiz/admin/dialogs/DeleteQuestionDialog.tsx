"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/app/_components/ui/dialog";

import { Button } from "@/app/_components/ui/button";
import { deleteQuizQuestion } from "@/app/_actions/quiz/delete";

export default function DeleteQuestionDialog({ open, setOpen, question }) {
  async function handleDelete() {
    await deleteQuizQuestion(question.id);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir Pergunta?</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground">
          Tem certeza que deseja excluir <b>"{question.question}"</b>? Esta ação
          não pode ser desfeita.
        </p>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>

          <Button variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
