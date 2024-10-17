// src/models/Sale.ts
import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

export const SaleSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID",
  }),
  volume: z.number().int().positive(),
  totalSalePrice: z.number().positive(),
  paymentMethod: z.enum(["cash", "card"]),
  date: z.date(),
});

export type SaleType = z.infer<typeof SaleSchema>;

interface ISale extends Document, Omit<SaleType, "productId"> {
  productId: mongoose.Types.ObjectId;
}

const saleSchema = new Schema<ISale>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    volume: { type: Number, required: true },
    totalSalePrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "card"], required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISale>("Sale", saleSchema);
