// src/models/Salary.ts
import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

export const SalarySchema = z.object({
  name: z.string().min(2).max(50),
  basePay: z.number().positive(),
  bonus: z.number().nonnegative(),
  totalPay: z.number().positive(),
  workDays: z.number().int().positive(),
  date: z.date(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
});

export type SalaryType = z.infer<typeof SalarySchema>;

interface ISalary extends Document, SalaryType {}

const salarySchema = new Schema<ISalary>({
  name: { type: String, required: true },
  basePay: { type: Number, required: true },
  bonus: { type: Number, required: true },
  totalPay: { type: Number, required: true },
  workDays: { type: Number, required: true },
  date: { type: Date, required: true },
  phone: { type: String, required: true },
});

export default mongoose.model<ISalary>("Salary", salarySchema);
