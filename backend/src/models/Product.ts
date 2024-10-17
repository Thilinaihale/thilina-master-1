// src/models/Product.ts
import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().min(2).max(50),
  quantity: z.number().int().nonnegative(),
  pricePerUnit: z.number().positive(),
  lastRestockDate: z.date(),
});

export type ProductType = z.infer<typeof ProductSchema>;

interface IProduct extends Document, ProductType {}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    lastRestockDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
