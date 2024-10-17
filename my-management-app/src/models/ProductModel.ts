// src/models/ProductModel.ts
import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().min(2).max(50),
  quantity: z.number().int().nonnegative(),
  pricePerUnit: z.number().positive(),
  lastRestockDate: z.date(),
});

export type ProductType = z.infer<typeof ProductSchema>;

export interface Product extends ProductType {
  _id: string;
}
