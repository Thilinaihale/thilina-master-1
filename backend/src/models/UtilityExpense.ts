// src/models/UtilityExpense.ts
import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

export const UtilityExpenseSchema = z.object({
  type: z.string().min(2).max(50),
  amount: z.number().positive(),
  date: z.date(),
  description: z.string().max(500).optional(),
});

export type UtilityExpenseType = z.infer<typeof UtilityExpenseSchema>;

interface IUtilityExpense extends Document, UtilityExpenseType {}

const utilityExpenseSchema = new Schema<IUtilityExpense>(
  {
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUtilityExpense>(
  "UtilityExpense",
  utilityExpenseSchema
);
