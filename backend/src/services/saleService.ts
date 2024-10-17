// src/services/saleService.ts
import Sale, { SaleType, SaleSchema } from "../models/Sale";

export const createSale = async (saleData: SaleType) => {
  const validatedData = SaleSchema.parse(saleData);
  const sale = new Sale(validatedData);
  return await sale.save();
};

export const getAllSales = async () => {
  return await Sale.find().populate("productId");
};

export const getSaleById = async (id: string) => {
  return await Sale.findById(id).populate("productId");
};

export const updateSale = async (id: string, saleData: Partial<SaleType>) => {
  const validatedData = SaleSchema.partial().parse(saleData);
  return await Sale.findByIdAndUpdate(id, validatedData, {
    new: true,
  }).populate("productId");
};

export const deleteSale = async (id: string) => {
  return await Sale.findByIdAndDelete(id);
};
