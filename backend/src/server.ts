// src/server.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import salaryRoutes from "./routes/salaryRoutes";
import productRoutes from "./routes/productRoutes";
import saleRoutes from "./routes/saleRoutes";
import utilityExpenseRoutes from "./routes/utilityExpenseRoutes";
import fuelUserRoutes from "./routes/fuelUserRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import employeeAttendanceRoutes from "./routes/employeeAttendanceRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use("/api/salaries", salaryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/utility-expenses", utilityExpenseRoutes);
app.use("/api/fuel-users", fuelUserRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/attendance", employeeAttendanceRoutes);
app.use("/api/appointment", appointmentRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
