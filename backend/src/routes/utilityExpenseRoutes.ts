// src/routes/utilityExpenseRoutes.ts
import express from "express";
import * as utilityExpenseController from "../controllers/utilityExpenseController";

const router = express.Router();

router.post("/", utilityExpenseController.createUtilityExpense);
router.get("/", utilityExpenseController.getAllUtilityExpenses);
router.get("/:id", utilityExpenseController.getUtilityExpenseById);
router.put("/:id", utilityExpenseController.updateUtilityExpense);
router.delete("/:id", utilityExpenseController.deleteUtilityExpense);

export default router;
