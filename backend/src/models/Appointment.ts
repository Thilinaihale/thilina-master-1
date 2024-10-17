import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Zod schema for validation
export const AppointmentSchema = z.object({
  carNumber: z.string().min(1).max(20),
  carType: z.string().min(1).max(50),
  vehicleType: z.string().min(1).max(50),
  serviceType: z.string().nullable().default(null),
  date: z.union([z.date(), z.string()]), // Accept both date and string
  time: z.string(),
  paymentMethod: z.enum(["cash", "card"]),
  price: z.number().nullable().default(null),
  status: z.enum(["accept", "reject", "pending"]).default("pending"),
  slotNumber: z.string(),
});

// TypeScript type derived from Zod schema
export type AppointmentType = z.infer<typeof AppointmentSchema>;

// Mongoose interface extending Document and AppointmentType
interface IAppointment extends Document, AppointmentType {}

// Mongoose schema
const appointmentSchema = new Schema<IAppointment>(
  {
    carNumber: { type: String, required: true },
    carType: { type: String, required: true },
    vehicleType: { type: String, required: true },
    serviceType: { type: String, default: null },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    paymentMethod: { type: String, enum: ["cash", "card"], required: true },
    price: { type: Number, default: null },
    status: {
      type: String,
      enum: ["accept", "reject", "pending"],
      default: "pending",
    },
    slotNumber: { type: String, required: true },
  },
  { timestamps: true }
);

// Pre-save middleware to convert `date` from string to Date
appointmentSchema.pre("save", function (next) {
  if (typeof this.date === "string") {
    this.date = new Date(this.date); // Convert string to Date object
  }
  next();
});

// Mongoose model
export default mongoose.model<IAppointment>("Appointment", appointmentSchema);
