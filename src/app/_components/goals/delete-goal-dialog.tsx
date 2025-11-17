"use client";

import { deleteGoal } from "@/app/_actions/goals/delete-goal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export default function DeleteGoalDialog({
  isOpen,
  setIsOpen,
  goalId,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  goalId: string;
}) {
  async function handleDelete() {
    await deleteGoal(goalId);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Meta</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta meta? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
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
