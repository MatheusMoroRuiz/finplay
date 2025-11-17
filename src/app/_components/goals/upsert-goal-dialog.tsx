"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { MoneyInput } from "../money-input";
import { Textarea } from "../ui/textarea";
import { DatePicker } from "../ui/date-picker";
import { upsertGoal } from "@/app/_actions/goals";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "O título é obrigatório."),
  amount: z.number().positive("O valor deve ser positivo."),
  current: z.number().min(0, "O progresso não pode ser negativo."),
  description: z.string().min(1, "A descrição é obrigatória."),
  deadline: z.date().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function UpsertGoalDialog({
  isOpen,
  setIsOpen,
  defaultValues,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  defaultValues?: FormSchema;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      title: "",
      amount: 0,
      current: 0,
      description: "",
      deadline: undefined,
    },
  });

  async function onSubmit(values: FormSchema) {
    await upsertGoal(values);
    setIsOpen(false);
    form.reset();
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Meta</DialogTitle>
          <DialogDescription>Preencha os campos abaixo</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* TÍTULO */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Comprar um carro..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* VALOR DESEJADO */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da meta</FormLabel>
                  <FormControl>
                    <MoneyInput
                      value={field.value}
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PROGRESSO ATUAL */}
            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progresso atual</FormLabel>
                  <FormControl>
                    <MoneyInput
                      value={field.value}
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIÇÃO */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva sua meta..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PRAZO */}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar Meta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
