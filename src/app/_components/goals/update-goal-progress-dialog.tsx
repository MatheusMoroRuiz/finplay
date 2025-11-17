"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { MoneyInput } from "../money-input";
import { updateGoalProgress } from "@/app/_actions/goals/update-progress";

const formSchema = z.object({
  id: z.string(),
  current: z.number().min(0),
});

type FormSchema = z.infer<typeof formSchema>;

export default function UpdateGoalProgressDialog({
  isOpen,
  setIsOpen,
  goalId,
  currentValue,
  goalAmount,
  onCompleted,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  goalId: string;
  currentValue: number;
  goalAmount: number;
  onCompleted: () => void;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: goalId,
      current: currentValue,
    },
  });

  async function onSubmit(values: FormSchema) {
    // 🔥 CORREÇÃO AQUI
    await updateGoalProgress(values.id, values.current);

    if (values.current >= goalAmount) {
      onCompleted();
    }

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
          <DialogTitle>Atualizar Progresso</DialogTitle>
          <DialogDescription>
            Insira o valor atual da sua meta.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo valor atual</FormLabel>
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

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
