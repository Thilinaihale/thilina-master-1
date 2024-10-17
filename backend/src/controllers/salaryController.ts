// src/controllers/salaryController.ts
import { Request, Response } from "express";
import * as salaryService from "../services/salaryService";
import { SalarySchema } from "../models/Salary";
import { ZodError } from "zod";

export const createSalary = async (req: Request, res: Response) => {
  try {
    const validatedData = SalarySchema.parse({
      ...req.body,
      date: new Date(req.body.date),
    });
    const salary = await salaryService.createSalary(validatedData);
    res.status(201).json(salary);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating salary" });
    }
  }
};

export const getAllSalaries = async (req: Request, res: Response) => {
  try {
    const salaries = await salaryService.getAllSalaries();
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching salaries" });
  }
};

export const getSalaryById = async (req: Request, res: Response) => {
  try {
    const salary = await salaryService.getSalaryById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: "Error fetching salary" });
  }
};

export const updateSalary = async (req: Request, res: Response) => {
  try {
    const validatedData = SalarySchema.parse({
      ...req.body,
      date: new Date(req.body.date),
    });
    const salary = await salaryService.updateSalary(
      req.params.id,
      validatedData
    );
    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }
    res.json(salary);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating salary" });
    }
  }
};

export const deleteSalary = async (req: Request, res: Response) => {
  try {
    const salary = await salaryService.deleteSalary(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }
    res.json({ message: "Salary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting salary" });
  }
};
