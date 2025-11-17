import { z } from "zod";

export const upsertGoalSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "O título é obrigatório."),
  amount: z.number().positive("O valor deve ser positivo."),
  current: z.number().min(0, "O progresso deve ser zero ou maior."),
  description: z.string().min(1, "A descrição é obrigatória."),
  deadline: z.date().optional(),
});

export type UpsertGoalSchema = z.infer<typeof upsertGoalSchema>;
