import { z } from "zod";

// Define TypeScript types for Employee
export type EmployeeType = {
  name: string;
  email: string;
  phone: string;
  address: string;
  nicNumber: string;
};

// Define the Employee model for interacting with the database
export interface Employee extends EmployeeType {
  _id: string; // The unique identifier for each employee (MongoDB uses _id)
}

// Define a schema for validating employee input using zod
export const EmployeeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),

  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().min(1, { message: "Department is required" }),
  nicNumber: z.string().min(1, { message: "Position is required" }),
});
