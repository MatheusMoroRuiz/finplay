"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui//button";
import { Input } from "@/app/_components/ui//input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/app/_components/ui//form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuizQuestion } from "@/app/_actions/quiz/create-question";

const schema = z.object({
  question: z.string().min(5),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  correct: z.enum(["A", "B", "C"]),
});

export default function CreateQuestionDialog({ open, setOpen }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      correct: "A",
    },
  });

  async function submit(values) {
    await createQuizQuestion(values);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Pergunta</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
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

            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="optionA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa A</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optionB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa B</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optionC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa C</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Criar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
