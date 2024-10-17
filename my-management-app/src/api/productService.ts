// src/services/productService.ts
import axios from "axios";
import { Product, ProductType } from "../models/ProductModel";

const API_URL = "http://localhost:8080/api/products";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createProduct = async (product: ProductType): Promise<Product> => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

export const updateProduct = async (
  id: string,
  product: ProductType
): Promise<Product> => {
  const response = await axios.put(`${API_URL}/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
