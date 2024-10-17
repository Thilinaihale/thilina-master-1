// src/models/FuelUser.ts
import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";
import bcrypt from "bcrypt";

export const FuelUserSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  type: z.enum(["admin", "user"]),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  email: z.string().email(),
  password: z.string().optional(),
  address: z.string().min(5).max(200),
});

export type FuelUserType = z.infer<typeof FuelUserSchema>;

interface IFuelUser extends Document, Omit<FuelUserType, "password"> {
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const fuelUserSchema = new Schema<IFuelUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    type: { type: String, enum: ["admin", "user"], required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

fuelUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

fuelUserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IFuelUser>("FuelUser", fuelUserSchema);
