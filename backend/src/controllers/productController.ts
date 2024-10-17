// src/controllers/productController.ts
import { Request, Response } from "express";
import * as productService from "../services/productService";
import { ProductSchema } from "../models/Product";
import { ZodError } from "zod";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = ProductSchema.parse({
      ...req.body,
      lastRestockDate: new Date(req.body.lastRestockDate),
    });
    const product = await productService.createProduct(validatedData);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating product" });
    }
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = ProductSchema.parse({
      ...req.body,
      lastRestockDate: new Date(req.body.lastRestockDate),
    });
    const product = await productService.updateProduct(
      req.params.id,
      validatedData
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating product" });
    }
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
