// src/controllers/utilityExpenseController.ts
import { Request, Response } from "express";
import * as utilityExpenseService from "../services/utilityExpenseService";
import { UtilityExpenseSchema } from "../models/UtilityExpense";
import { ZodError } from "zod";

export const createUtilityExpense = async (req: Request, res: Response) => {
  try {
    const validatedData = UtilityExpenseSchema.parse({
      ...req.body,
      date: new Date(req.body.date),
    });
    const expense = await utilityExpenseService.createUtilityExpense(
      validatedData
    );
    res.status(201).json(expense);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating utility expense" });
    }
  }
};

export const getAllUtilityExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await utilityExpenseService.getAllUtilityExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching utility expenses" });
  }
};

export const getUtilityExpenseById = async (req: Request, res: Response) => {
  try {
    const expense = await utilityExpenseService.getUtilityExpenseById(
      req.params.id
    );
    if (!expense) {
      return res.status(404).json({ message: "Utility expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error fetching utility expense" });
  }
};

export const updateUtilityExpense = async (req: Request, res: Response) => {
  try {
    const validatedData = UtilityExpenseSchema.partial().parse({
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined,
    });
    const expense = await utilityExpenseService.updateUtilityExpense(
      req.params.id,
      validatedData
    );
    if (!expense) {
      return res.status(404).json({ message: "Utility expense not found" });
    }
    res.json(expense);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating utility expense" });
    }
  }
};

export const deleteUtilityExpense = async (req: Request, res: Response) => {
  try {
    const expense = await utilityExpenseService.deleteUtilityExpense(
      req.params.id
    );
    if (!expense) {
      return res.status(404).json({ message: "Utility expense not found" });
    }
    res.json({ message: "Utility expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting utility expense" });
  }
};
