// src/controllers/fuelUserController.ts
import { Request, Response } from "express";
import * as fuelUserService from "../services/fuelUserService";
import { FuelUserSchema } from "../models/FuelUser";
import { ZodError } from "zod";

export const createFuelUser = async (req: Request, res: Response) => {
  try {
    const validatedData = FuelUserSchema.parse(req.body);
    const user = await fuelUserService.createFuelUser(validatedData);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating user" });
    }
  }
};

export const getAllFuelUsers = async (req: Request, res: Response) => {
  try {
    const users = await fuelUserService.getAllFuelUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getFuelUserById = async (req: Request, res: Response) => {
  try {
    const user = await fuelUserService.getFuelUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const updateFuelUser = async (req: Request, res: Response) => {
  try {
    const validatedData = FuelUserSchema.partial().parse(req.body);
    const user = await fuelUserService.updateFuelUser(
      req.params.id,
      validatedData
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating user" });
    }
  }
};

export const deleteFuelUser = async (req: Request, res: Response) => {
  try {
    const user = await fuelUserService.deleteFuelUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const loginFuelUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await fuelUserService.loginFuelUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
