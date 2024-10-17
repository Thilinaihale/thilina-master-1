import axios from "axios";
import { Salary, SalaryType } from "../models/SalaryModel";

const API_URL = "http://localhost:8080/api/salaries";

export const getAllSalaries = async (): Promise<Salary[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getSalaryById = async (id: string): Promise<Salary> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createSalary = async (salary: SalaryType): Promise<Salary> => {
  const response = await axios.post(API_URL, salary);
  return response.data;
};

export const updateSalary = async (
  id: string,
  salary: SalaryType
): Promise<Salary> => {
  const response = await axios.put(`${API_URL}/${id}`, salary);
  return response.data;
};

export const deleteSalary = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
