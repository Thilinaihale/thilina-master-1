import axiosInstance from "./axiosInstance";

const APPOINTMENT_URL = "/appointment";

// Get all appointments
export const getAllAppointments = async () => {
  try {
    const response = await axiosInstance.get(`${APPOINTMENT_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${APPOINTMENT_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData: any) => {
  try {
    const response = await axiosInstance.post(
      `${APPOINTMENT_URL}`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (id: string, appointmentData: any) => {
  try {
    const response = await axiosInstance.put(
      `${APPOINTMENT_URL}/${id}`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`${APPOINTMENT_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};
