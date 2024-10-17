// src/routes/saleRoutes.ts
import express from "express";
import * as saleController from "../controllers/saleController";

const router = express.Router();

router.post("/", saleController.createSale);
router.get("/", saleController.getAllSales);
router.get("/:id", saleController.getSaleById);
router.put("/:id", saleController.updateSale);
router.delete("/:id", saleController.deleteSale);

export default router;
