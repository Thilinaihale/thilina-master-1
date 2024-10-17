// src/services/saleService.ts
import axios from "axios";
import { Sale, SaleType } from "../models/SaleModel";

const API_URL = "http://localhost:8080/api/sales";

export const getAllSales = async (): Promise<Sale[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getSaleById = async (id: string): Promise<Sale> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createSale = async (sale: SaleType): Promise<Sale> => {
  const response = await axios.post(API_URL, sale);
  return response.data;
};

export const updateSale = async (
  id: string,
  sale: Partial<SaleType>
): Promise<Sale> => {
  const response = await axios.put(`${API_URL}/${id}`, sale);
  return response.data;
};

export const deleteSale = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
