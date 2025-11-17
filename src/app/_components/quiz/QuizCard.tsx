"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { answerQuiz } from "@/app/_actions/quiz/answer-quiz";

export default function QuizCard({ question }) {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(0);

  // calcula tempo restante
  useEffect(() => {
    const expires = new Date(question.expiresAt).getTime();

    function update() {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));

      setTimeLeft(diff);

      if (diff <= 0) {
        setStatus("expired");
      }
    }

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [question.expiresAt]);

  function formatTimer(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  async function submit() {
    if (!selected) return;
    setStatus("loading");

    const res = await answerQuiz(question.id, selected);

    setStatus(res.correct ? "correct" : "wrong");
  }

  return (
    <div className="p-6 border rounded-xl bg-card shadow-sm space-y-6">
      {/* TIMER */}
      {status !== "expired" ? (
        <p className="text-sm text-center text-muted-foreground">
          Expira em: <span className="font-bold">{formatTimer(timeLeft)}</span>
        </p>
      ) : (
        <p className="text-red-500 text-center font-semibold">
          ❌ Tempo esgotado!
        </p>
      )}

      <h2 className="text-xl font-semibold">{question.question}</h2>

      {/* ALTERNATIVAS */}
      <div className="space-y-3">
        {["A", "B", "C"].map((opt) => (
          <button
            key={opt}
            disabled={status !== "idle" && status !== "loading"}
            onClick={() => setSelected(opt)}
            className={`w-full text-left p-3 rounded-lg border transition-all
              ${
                selected === opt
                  ? "border-primary bg-primary/10"
                  : "border-muted"
              }
            `}
          >
            {opt === "A" && question.optionA}
            {opt === "B" && question.optionB}
            {opt === "C" && question.optionC}
          </button>
        ))}
      </div>

      {/* STATUS */}
      {status === "correct" && (
        <p className="text-green-500 font-medium text-center">
          ✔ Resposta correta! Você ganhou XP 🎉
        </p>
      )}

      {status === "wrong" && (
        <p className="text-red-500 font-medium text-center">
          ✖ Resposta errada!
        </p>
      )}

      {/* BOTÃO */}
      {status === "idle" && (
        <Button disabled={!selected} onClick={submit}>
          Responder
        </Button>
      )}
    </div>
  );
}
