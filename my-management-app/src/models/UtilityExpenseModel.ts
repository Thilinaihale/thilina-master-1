// src/models/UtilityExpenseModel.ts
import { z } from "zod";

export const UtilityExpenseSchema = z.object({
  type: z.string().min(2).max(50),
  amount: z.number().positive(),
  date: z.date(),
  description: z.string().max(500).optional(),
});

export type UtilityExpenseType = z.infer<typeof UtilityExpenseSchema>;

export interface UtilityExpense extends UtilityExpenseType {
  _id: string;
}
