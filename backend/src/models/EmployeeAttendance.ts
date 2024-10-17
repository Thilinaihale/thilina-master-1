// src/models/EmployeeAttendance.ts
import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Zod schema for validation
export const EmployeeAttendanceSchema = z.object({
  employeeId: z.string().min(1),
  arrivalTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  departureTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  shiftType: z.enum(["over_time", "in_time", "half_time"]),
});

// Type inference
export type EmployeeAttendanceType = z.infer<typeof EmployeeAttendanceSchema>;

interface IEmployeeAttendance extends Document, EmployeeAttendanceType {}

// Mongoose schema definition
const employeeAttendanceSchema = new Schema<IEmployeeAttendance>(
  {
    employeeId: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    departureTime: { type: String, required: true },
    shiftType: {
      type: String,
      enum: ["over_time", "in_time", "half_time"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IEmployeeAttendance>(
  "EmployeeAttendance",
  employeeAttendanceSchema
);
