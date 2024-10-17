// src/services/employeeAttendanceService.ts
import axiosInstance from "./axiosInstance";

const ATTENDANCE_URL = "/attendance";

// Get all employee attendance records
export const getAllAttendanceRecords = async () => {
  try {
    const response = await axiosInstance.get(`${ATTENDANCE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    throw error;
  }
};

// Get attendance by ID
export const getAttendanceById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${ATTENDANCE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance record:", error);
    throw error;
  }
};

// Create a new attendance record
export const createAttendanceRecord = async (attendanceData: any) => {
  try {
    const response = await axiosInstance.post(
      `${ATTENDANCE_URL}`,
      attendanceData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating attendance record:", error);
    throw error;
  }
};

// Update an attendance record
export const updateAttendanceRecord = async (
  id: string,
  attendanceData: any
) => {
  try {
    const response = await axiosInstance.put(
      `${ATTENDANCE_URL}/${id}`,
      attendanceData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating attendance record:", error);
    throw error;
  }
};

// Delete an attendance record
export const deleteAttendanceRecord = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`${ATTENDANCE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    throw error;
  }
};
