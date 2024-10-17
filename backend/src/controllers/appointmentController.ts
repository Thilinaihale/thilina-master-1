import { Request, Response } from "express";
import * as appointmentService from "../services/appointmentService";
import { AppointmentSchema } from "../models/Appointment";
import { ZodError } from "zod";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const validatedData = AppointmentSchema.parse(req.body);
    const appointment = await appointmentService.createAppointment(
      validatedData
    );
    res.status(201).json(appointment);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating appointment" });
    }
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await appointmentService.getAllAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await appointmentService.getAppointmentById(
      req.params.id
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment" });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const validatedData = AppointmentSchema.partial().parse(req.body);
    const appointment = await appointmentService.updateAppointment(
      req.params.id,
      validatedData
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating appointment" });
    }
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await appointmentService.deleteAppointment(
      req.params.id
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment" });
  }
};
