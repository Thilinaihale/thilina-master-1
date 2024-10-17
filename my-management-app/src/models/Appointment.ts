import { z } from "zod";

// Define TypeScript types for Appointment
export type AppointmentType = {
  _id?: string;
  carNumber: string;
  carType: string;
  vehicleType: string;
  serviceType: string | null;
  date: Date;
  time: string;
  paymentMethod: "cash" | "card";
  price: number | null;
  status: "accept" | "reject" | "pending";
  slotNumber: string;
};

// Define the Appointment model for interacting with the database
export interface Appointment extends AppointmentType {
  _id: string; // The unique identifier for each appointment (MongoDB uses _id)
}

// Define a schema for validating appointment input using zod
export const AppointmentSchema = z.object({
  carNumber: z.string().min(1, { message: "Car number is required" }),
  carType: z.string().min(1, { message: "Car type is required" }),
  vehicleType: z.string().min(1, { message: "Vehicle type is required" }),
  serviceType: z.string().nullable().default(null),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format",
  }),
  paymentMethod: z.enum(["cash", "card"], {
    required_error: "Payment method is required",
  }),
  price: z.number().nullable().default(null),
  status: z.enum(["accept", "reject", "pending"]).default("pending"),
  slotNumber: z.string().min(1, { message: "Slot number is required" }),
});
