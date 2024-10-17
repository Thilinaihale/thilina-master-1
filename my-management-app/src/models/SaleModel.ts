// src/models/Sale.ts

import { z } from "zod";

export const SaleSchema = z.object({
  productId: z.string(),
  volume: z.number().int().positive(),
  totalSalePrice: z.number().positive(),
  paymentMethod: z.enum(["cash", "card"]),
  date: z.date(),
});

export type SaleType = z.infer<typeof SaleSchema>;

export interface Sale extends SaleType {
  _id: string;
}
