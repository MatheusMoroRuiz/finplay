"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { Trophy } from "lucide-react";

export default function GoalCompletedModal({
  goal,
  onClose,
}: {
  goal: { title: string };
  onClose: () => void;
}) {
  useEffect(() => {
    const duration = 2500;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return clearInterval(interval);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="text-center space-y-6 py-10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex justify-center items-center gap-3 text-green-500">
            <Trophy size={40} className="text-yellow-400" />
            Parabéns!
          </DialogTitle>
        </DialogHeader>

        <p className="text-lg text-muted-foreground">Você concluiu sua meta:</p>

        <p className="text-2xl font-semibold">{goal.title}</p>

        <button
          onClick={onClose}
          className="mx-auto mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
        >
          Continuar
        </button>
      </DialogContent>
    </Dialog>
  );
}
