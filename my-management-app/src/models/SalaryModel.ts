import { z } from "zod";
export interface Salary {
  _id?: string;
  name: string;
  basePay: number;
  bonus: number;
  totalPay: number;
  workDays: number;
  date: Date;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Salary schema (or import it from a shared file if available)
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
