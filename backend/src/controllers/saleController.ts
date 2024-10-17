// src/controllers/saleController.ts
import { Request, Response } from "express";
import * as saleService from "../services/saleService";
import { SaleSchema } from "../models/Sale";
import { ZodError } from "zod";

export const createSale = async (req: Request, res: Response) => {
  try {
    const validatedData = SaleSchema.parse({
      ...req.body,
      date: new Date(req.body.date),
    });
    const sale = await saleService.createSale(validatedData);
    res.status(201).json(sale);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating sale" });
    }
  }
};

export const getAllSales = async (req: Request, res: Response) => {
  try {
    const sales = await saleService.getAllSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales" });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sale" });
  }
};

export const updateSale = async (req: Request, res: Response) => {
  try {
    const validatedData = SaleSchema.parse({
      ...req.body,
      date: new Date(req.body.date),
    });
    const sale = await saleService.updateSale(req.params.id, validatedData);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.json(sale);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating sale" });
    }
  }
};

export const deleteSale = async (req: Request, res: Response) => {
  try {
    const sale = await saleService.deleteSale(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sale" });
  }
};
