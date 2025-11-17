"use client";

import { Dialog, DialogContent } from "@/app/_components/ui/dialog";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function LevelUpModal({ level }: { level: number }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {open && <Confetti />}
      <DialogContent className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-primary">🎉 Level Up!</h2>
        <p className="text-xl">
          Agora você é nível <b>{level}</b>!
        </p>
      </DialogContent>
    </Dialog>
  );
}
