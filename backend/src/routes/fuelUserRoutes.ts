// src/routes/fuelUserRoutes.ts
import express from "express";
import * as fuelUserController from "../controllers/fuelUserController";

const router = express.Router();

router.post("/", fuelUserController.createFuelUser);
router.get("/", fuelUserController.getAllFuelUsers);
router.get("/:id", fuelUserController.getFuelUserById);
router.put("/:id", fuelUserController.updateFuelUser);
router.delete("/:id", fuelUserController.deleteFuelUser);
router.post("/login", fuelUserController.loginFuelUser);

export default router;
