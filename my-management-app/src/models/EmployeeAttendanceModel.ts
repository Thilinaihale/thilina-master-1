import { z } from "zod";

// Define TypeScript types for Employee Attendance
export type EmployeeAttendanceType = {
  employeeId: string; // The unique identifier for the employee
  arrivalTime: string; // The time the employee arrived
  departureTime: string; // The time the employee departed
  shiftType: "over_time" | "in_time" | "half_time"; // Shift type as an enum
};

// Define the EmployeeAttendance model for interacting with the database
export interface EmployeeAttendance extends EmployeeAttendanceType {
  _id: string; // The unique identifier for each attendance record (MongoDB uses _id)
}

// Define a schema for validating employee attendance input using zod
export const EmployeeAttendanceSchema = z.object({
  employeeId: z.string().min(1, { message: "Employee ID is required" }),

  arrivalTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid arrival time",
    }),

  departureTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid departure time",
    }),

  shiftType: z.enum(["over_time", "in_time", "half_time"], {
    message: "Invalid shift type",
  }),
});
