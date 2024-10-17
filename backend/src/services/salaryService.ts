// src/services/salaryService.ts
import Salary, { SalaryType, SalarySchema } from "../models/Salary";

export const createSalary = async (salaryData: SalaryType) => {
  const validatedData = SalarySchema.parse(salaryData);
  const salary = new Salary(validatedData);
  return await salary.save();
};

export const getAllSalaries = async () => {
  return await Salary.find();
};

export const getSalaryById = async (id: string) => {
  return await Salary.findById(id);
};

export const updateSalary = async (
  id: string,
  salaryData: Partial<SalaryType>
) => {
  const validatedData = SalarySchema.partial().parse(salaryData);
  return await Salary.findByIdAndUpdate(id, validatedData, { new: true });
};

export const deleteSalary = async (id: string) => {
  return await Salary.findByIdAndDelete(id);
};
