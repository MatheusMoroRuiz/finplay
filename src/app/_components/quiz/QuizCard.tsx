"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { answerQuiz } from "@/app/_actions/quiz/answer-quiz";

export default function QuizCard({ question, remaining }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "correct" | "wrong" | "loading"
  >("idle");

  async function submit() {
    if (!selected) return;
    setStatus("loading");

    const res = await answerQuiz(question.id, selected);

    if (res.correct) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }

    // 🔥 Evita responder 2x — recarrega a página após 1.5s
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  const isAnswered = status === "correct" || status === "wrong";

  return (
    <div className="p-6 border rounded-xl bg-card shadow-sm space-y-6">
      <h2 className="text-xl font-semibold">{question.question}</h2>

      {/* ALTERNATIVAS */}
      <div className="space-y-3">
        {["A", "B", "C"].map((opt) => (
          <button
            key={opt}
            disabled={isAnswered} // 🔒 bloqueia após resposta
            onClick={() => setSelected(opt)}
            className={`
              w-full text-left p-3 rounded-lg border transition-all
              ${
                selected === opt
                  ? "border-primary bg-primary/10"
                  : "border-muted"
              }
              ${isAnswered ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {opt === "A" && question.optionA}
            {opt === "B" && question.optionB}
            {opt === "C" && question.optionC}
          </button>
        ))}
      </div>

      {/* FEEDBACK */}
      {status === "correct" && (
        <p className="text-green-500 font-medium">
          ✔ Resposta correta! Você ganhou XP 🎉
        </p>
      )}

      {status === "wrong" && (
        <p className="text-red-500 font-medium">
          ✖ Resposta errada… tente novamente amanhã!
        </p>
      )}

      {/* BOTÃO RESPONDER */}
      {!isAnswered && (
        <Button disabled={!selected || status === "loading"} onClick={submit}>
          {status === "loading"
            ? "Enviando..."
            : `Responder (${remaining - 1} restantes)`}
        </Button>
      )}
    </div>
  );
}
