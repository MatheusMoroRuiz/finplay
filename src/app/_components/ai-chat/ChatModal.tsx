"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { askAiAssistant } from "@/app/(home)/_actions/ask-ai-assistant";

export default function ChatModal({ onClose, userName }: any) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `👋 Olá ${userName}! Sou seu assistente financeiro. Como posso te ajudar hoje?`,
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (msg?: string) => {
    const text = msg || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setTyping(true);

    const response = await askAiAssistant({
      userMessage: text,
      userName,
    });

    setMessages((prev) => [...prev, { role: "assistant", content: response }]);

    setTyping(false);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const quickActions = [
    "Como posso economizar este mês?",
    "Me dê uma estratégia para investir melhor.",
    "Analise minhas despesas e me dê dicas.",
    "Quero fazer uma reserva de emergência.",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end p-4 z-[999]">
      {/* CONTAINER PRINCIPAL */}
      <div className="w-full max-w-sm bg-[#0f0f0f] rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden border border-neutral-800">
        {/* HEADER */}
        <div className="bg-[#111111] border-b border-neutral-800 text-white px-5 py-4 flex justify-between items-center">
          <h2 className="font-semibold text-lg">DM - Assistente Financeiro</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* CHAT */}
        <div
          ref={scrollRef}
          className="flex-1 px-4 py-4 overflow-y-auto bg-[#0f0f0f] space-y-4"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                msg.role === "user"
                  ? "ml-auto bg-[#1d3b25] text-[#9dffb0] border border-[#2e5c3a]"
                  : "bg-[#1a1a1a] text-gray-200 border border-neutral-800"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {/* TYPING ANIMATION */}
          {typing && (
            <div className="bg-[#1a1a1a] border border-neutral-700 p-3 rounded-xl inline-flex gap-2 items-center">
              <Loader2 className="animate-spin text-gray-400" size={16} />
              <span className="text-gray-400 text-sm">Digitando…</span>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="px-4 py-3 border-t border-neutral-800 bg-[#0f0f0f] flex flex-wrap gap-2">
          {quickActions.map((act) => (
            <button
              key={act}
              onClick={() => sendMessage(act)}
              className="text-xs px-3 py-1.5 rounded-full bg-[#1a1a1a] hover:bg-[#222] text-gray-300 border border-neutral-700 transition"
            >
              {act}
            </button>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 bg-[#0f0f0f] border-t border-neutral-800 flex items-center gap-3">
          <input
            className="flex-1 bg-[#1a1a1a] px-4 py-3 rounded-full border border-neutral-700 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/40"
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={() => sendMessage()}
            className="bg-[#2ecc71] text-black p-3 rounded-full hover:bg-[#29b866] transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
