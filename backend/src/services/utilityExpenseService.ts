// src/services/utilityExpenseService.ts
import UtilityExpense, {
  UtilityExpenseType,
  UtilityExpenseSchema,
} from "../models/UtilityExpense";

export const createUtilityExpense = async (expenseData: UtilityExpenseType) => {
  const validatedData = UtilityExpenseSchema.parse(expenseData);
  const expense = new UtilityExpense(validatedData);
  return await expense.save();
};

export const getAllUtilityExpenses = async () => {
  return await UtilityExpense.find();
};

export const getUtilityExpenseById = async (id: string) => {
  return await UtilityExpense.findById(id);
};

export const updateUtilityExpense = async (
  id: string,
  expenseData: Partial<UtilityExpenseType>
) => {
  const validatedData = UtilityExpenseSchema.partial().parse(expenseData);
  return await UtilityExpense.findByIdAndUpdate(id, validatedData, {
    new: true,
  });
};

export const deleteUtilityExpense = async (id: string) => {
  return await UtilityExpense.findByIdAndDelete(id);
};
