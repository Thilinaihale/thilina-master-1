// src/services/utilityExpenseService.ts
import axios from "axios";
import {
  UtilityExpense,
  UtilityExpenseType,
} from "../models/UtilityExpenseModel";

const API_URL = "http://localhost:8080/api/utility-expenses";

export const getAllUtilityExpenses = async (): Promise<UtilityExpense[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getUtilityExpenseById = async (
  id: string
): Promise<UtilityExpense> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createUtilityExpense = async (
  expense: UtilityExpenseType
): Promise<UtilityExpense> => {
  const response = await axios.post(API_URL, expense);
  return response.data;
};

export const updateUtilityExpense = async (
  id: string,
  expense: UtilityExpenseType
): Promise<UtilityExpense> => {
  const response = await axios.put(`${API_URL}/${id}`, expense);
  return response.data;
};

export const deleteUtilityExpense = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
