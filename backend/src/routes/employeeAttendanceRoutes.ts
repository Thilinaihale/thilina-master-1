// src/routes/employeeAttendanceRoutes.ts
import express from "express";
import * as employeeAttendanceController from "../controllers/employeeAttendanceController";

const router = express.Router();

router.post("/", employeeAttendanceController.createAttendance);
router.get("/", employeeAttendanceController.getAllAttendance);
router.get("/:id", employeeAttendanceController.getAttendanceById);
router.put("/:id", employeeAttendanceController.updateAttendance);
router.delete("/:id", employeeAttendanceController.deleteAttendance);

export default router;
