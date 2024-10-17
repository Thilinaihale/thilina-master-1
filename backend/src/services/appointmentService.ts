import Appointment, { AppointmentType } from "../models/Appointment";

/**
 * Create a new appointment
 * @param appointmentData - The appointment details to create
 * @returns The created appointment
 */
export const createAppointment = async (appointmentData: AppointmentType) => {
  try {
    const appointment = new Appointment(appointmentData);
    return await appointment.save();
  } catch (error) {
    throw new Error("Error creating appointment: " + error);
  }
};

/**
 * Get all appointments
 * @returns List of all appointments
 */
export const getAllAppointments = async () => {
  try {
    return await Appointment.find();
  } catch (error) {
    throw new Error("Error fetching appointments: " + error);
  }
};

/**
 * Get an appointment by ID
 * @param id - The ID of the appointment to retrieve
 * @returns The appointment, if found
 */
export const getAppointmentById = async (id: string) => {
  try {
    return await Appointment.findById(id);
  } catch (error) {
    throw new Error("Error fetching appointment: " + error);
  }
};

/**
 * Update an existing appointment by ID
 * @param id - The ID of the appointment to update
 * @param updateData - The new appointment data
 * @returns The updated appointment, if found
 */
export const updateAppointment = async (
  id: string,
  updateData: Partial<AppointmentType>
) => {
  try {
    return await Appointment.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw new Error("Error updating appointment: " + error);
  }
};

/**
 * Delete an appointment by ID
 * @param id - The ID of the appointment to delete
 * @returns The deleted appointment, if found
 */
export const deleteAppointment = async (id: string) => {
  try {
    return await Appointment.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error deleting appointment: " + error);
  }
};
