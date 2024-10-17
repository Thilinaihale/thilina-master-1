import { Request, Response } from "express";
import * as employeeService from "../services/employeeService";
import { EmployeeSchema } from "../models/Employee";
import { ZodError } from "zod";

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const validatedData = EmployeeSchema.parse(req.body);
    const employee = await employeeService.createEmployee(validatedData);
    res.status(201).json(employee);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating employee" });
    }
  }
};

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee" });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const validatedData = EmployeeSchema.partial().parse(req.body);
    const employee = await employeeService.updateEmployee(
      req.params.id,
      validatedData
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating employee" });
    }
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await employeeService.deleteEmployee(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee" });
  }
};
