// src/services/employeeService.ts
import axiosInstance from "./axiosInstance";

const EMPLOYEE_URL = "/employee";

// Get all employees
export const getAllEmployees = async () => {
  try {
    const response = await axiosInstance.get(`${EMPLOYEE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Get employee by ID
export const getEmployeeById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${EMPLOYEE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }
};

// Create a new employee
export const createEmployee = async (employeeData: any) => {
  try {
    const response = await axiosInstance.post(`${EMPLOYEE_URL}`, employeeData);
    return response.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

// Update an employee
export const updateEmployee = async (id: string, employeeData: any) => {
  try {
    const response = await axiosInstance.put(
      `${EMPLOYEE_URL}/${id}`,
      employeeData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// Delete an employee
export const deleteEmployee = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`${EMPLOYEE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};
