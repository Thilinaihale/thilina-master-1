// src/models/UserModel.ts
import { z } from "zod";

export const UserSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  type: z.enum(["admin", "user"]),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  email: z.string().email(),
  password: z.string().optional(),
  address: z.string().min(5).max(200),
});

export type UserType = z.infer<typeof UserSchema>;

export interface User extends Omit<UserType, "password"> {
  _id: string;
}
