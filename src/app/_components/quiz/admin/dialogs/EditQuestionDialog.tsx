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
import { Input } from "@/app/_components/ui/input";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/app/_components/ui/form";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateQuizQuestion } from "@/app/_actions/quiz/update";

const schema = z.object({
  id: z.string(),
  question: z.string().min(5, "A pergunta é obrigatória."),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  correct: z.enum(["A", "B", "C"]),
});

export default function EditQuestionDialog({ open, setOpen, question }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: question.id,
      question: question.question,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      correct: question.correct,
    },
  });

  async function submit(values) {
    await updateQuizQuestion(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Pergunta</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
            {/* PERGUNTA */}
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pergunta</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a pergunta..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ALTERNATIVAS */}
            <div className="grid grid-cols-3 gap-3">
              {/* A */}
              <FormField
                control={form.control}
                name="optionA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa A</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto da A..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* B */}
              <FormField
                control={form.control}
                name="optionB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa B</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto da B..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* C */}
              <FormField
                control={form.control}
                name="optionC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa C</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto da C..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* CORRETA */}
            <FormField
              control={form.control}
              name="correct"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resposta correta</FormLabel>
                  <FormControl>
                    <select
                      className="border rounded-md p-2 bg-background"
                      {...field}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FOOTER */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>

              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
