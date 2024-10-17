// src/services/userService.ts
import axios from "axios";
import { User, UserType } from "../models/UserModel";

const API_URL = "http://localhost:8080/api/fuel-users";

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createUser = async (user: UserType): Promise<User> => {
  const response = await axios.post(API_URL, user);
  return response.data;
};

export const updateUser = async (
  id: string,
  user: Partial<UserType>
): Promise<User> => {
  const response = await axios.put(`${API_URL}/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<any> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};
