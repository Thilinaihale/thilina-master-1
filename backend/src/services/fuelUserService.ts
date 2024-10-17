// src/services/fuelUserService.ts
import FuelUser, { FuelUserType, FuelUserSchema } from "../models/FuelUser";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const createFuelUser = async (userData: FuelUserType) => {
  const validatedData = FuelUserSchema.parse(userData);
  const user = new FuelUser(validatedData);
  return await user.save();
};

export const getAllFuelUsers = async () => {
  return await FuelUser.find().select("-password");
};

export const getFuelUserById = async (id: string) => {
  return await FuelUser.findById(id).select("-password");
};

export const updateFuelUser = async (
  id: string,
  userData: Partial<FuelUserType>
) => {
  const validatedData = FuelUserSchema.partial().parse(userData);
  return await FuelUser.findByIdAndUpdate(id, validatedData, {
    new: true,
  }).select("-password");
};

export const deleteFuelUser = async (id: string) => {
  return await FuelUser.findByIdAndDelete(id);
};

export const loginFuelUser = async (email: string, password: string) => {
  const user = await FuelUser.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id, type: user.type }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return { user: user.toObject({ virtuals: true, versionKey: false }), token };
};
