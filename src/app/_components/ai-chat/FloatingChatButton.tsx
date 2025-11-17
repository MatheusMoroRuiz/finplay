"use client";

import { useState } from "react";
import { MessageCircle, Lock } from "lucide-react";
import ChatModal from "./ChatModal";

interface FloatingChatButtonProps {
  hasPremiumPlan: boolean;
  userName: string;
}

export default function FloatingChatButton({
  hasPremiumPlan,
  userName,
}: FloatingChatButtonProps) {
  const [open, setOpen] = useState(false);
  const [showPremiumWarning, setShowPremiumWarning] = useState(false);

  const handleClick = () => {
    if (!hasPremiumPlan) {
      setShowPremiumWarning(true);
      return;
    }
    setOpen(true);
  };

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
      >
        <MessageCircle size={26} />
      </button>

      {/* MODAL DO CHAT */}
      {open && <ChatModal userName={userName} onClose={() => setOpen(false)} />}

      {/* AVISO PREMIUM */}
      {showPremiumWarning && (
        <div className="fixed bottom-20 right-6 bg-neutral-900 border border-neutral-700 p-4 rounded-md shadow-xl w-72 animate-in fade-in">
          <p className="font-semibold mb-1">Recurso Premium</p>
          <p className="text-sm text-muted-foreground">
            O assistente financeiro por IA é exclusivo para assinantes Premium.
          </p>

          <a
            href="/subscription"
            className="block text-center mt-3 bg-primary text-primary-foreground py-2 rounded-md"
          >
            Assinar Premium
          </a>

          <button
            className="mt-2 text-xs text-muted-foreground hover:underline"
            onClick={() => setShowPremiumWarning(false)}
          >
            Fechar
          </button>
        </div>
      )}
    </>
  );
}
