"use client";

import { useState } from "react";

export default function CreateQuizForm() {
  const [loading, setLoading] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    await fetch("/api/quiz/admin", {
      method: "POST",
      body: form,
    });

    alert("Pergunta adicionada!");
    e.target.reset();
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        name="question"
        placeholder="Pergunta"
        className="input"
        required
      />
      <input name="optionA" placeholder="Opção A" className="input" required />
      <input name="optionB" placeholder="Opção B" className="input" required />
      <input name="optionC" placeholder="Opção C" className="input" required />

      <select name="correct" className="input" required>
        <option value="A">Correta: A</option>
        <option value="B">Correta: B</option>
        <option value="C">Correta: C</option>
      </select>

      <button className="btn-primary" disabled={loading}>
        Criar Pergunta
      </button>
    </form>
  );
}
