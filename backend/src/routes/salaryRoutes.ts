// src/routes/salaryRoutes.ts
import express from "express";
import * as salaryController from "../controllers/salaryController";

const router = express.Router();

router.post("/", salaryController.createSalary);
router.get("/", salaryController.getAllSalaries);
router.get("/:id", salaryController.getSalaryById);
router.put("/:id", salaryController.updateSalary);
router.delete("/:id", salaryController.deleteSalary);

export default router;
