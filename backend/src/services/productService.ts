// src/services/productService.ts
import Product, { ProductType, ProductSchema } from "../models/Product";

export const createProduct = async (productData: ProductType) => {
  const validatedData = ProductSchema.parse(productData);
  const product = new Product(validatedData);
  return await product.save();
};

export const getAllProducts = async () => {
  return await Product.find();
};

export const getProductById = async (id: string) => {
  return await Product.findById(id);
};

export const updateProduct = async (
  id: string,
  productData: Partial<ProductType>
) => {
  const validatedData = ProductSchema.partial().parse(productData);
  return await Product.findByIdAndUpdate(id, validatedData, { new: true });
};

export const deleteProduct = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};
