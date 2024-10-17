// src/controllers/employeeAttendanceController.ts
import { Request, Response } from "express";
import * as employeeAttendanceService from "../services/employeeAttendanceService";
import { EmployeeAttendanceSchema } from "../models/EmployeeAttendance";
import { ZodError } from "zod";

export const createAttendance = async (req: Request, res: Response) => {
  try {
    const validatedData = EmployeeAttendanceSchema.parse(req.body);
    const attendance = await employeeAttendanceService.createAttendanceRecord(
      validatedData
    );
    res.status(201).json(attendance);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating attendance record" });
    }
  }
};

export const getAllAttendance = async (req: Request, res: Response) => {
  try {
    const attendanceRecords =
      await employeeAttendanceService.getAllAttendanceRecords();
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance records" });
  }
};

export const getAttendanceById = async (req: Request, res: Response) => {
  try {
    const attendanceRecord = await employeeAttendanceService.getAttendanceById(
      req.params.id
    );
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json(attendanceRecord);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance record" });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const validatedData = EmployeeAttendanceSchema.partial().parse(req.body);
    const attendanceRecord =
      await employeeAttendanceService.updateAttendanceRecord(
        req.params.id,
        validatedData
      );
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json(attendanceRecord);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating attendance record" });
    }
  }
};

export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const attendanceRecord =
      await employeeAttendanceService.deleteAttendanceRecord(req.params.id);
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting attendance record" });
  }
};
