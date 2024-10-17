import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

export const EmployeeSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  address: z.string().min(5).max(200),
  nicNumber: z.string().min(10).max(12),
});

export type EmployeeType = z.infer<typeof EmployeeSchema>;

interface IEmployee extends Document, EmployeeType {}

const employeeSchema = new Schema<IEmployee>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    nicNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEmployee>("Employee", employeeSchema);
