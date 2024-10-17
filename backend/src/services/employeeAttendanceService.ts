// src/services/employeeAttendanceService.ts
import EmployeeAttendance, {
  EmployeeAttendanceSchema,
  EmployeeAttendanceType,
} from "../models/EmployeeAttendance";

export const createAttendanceRecord = async (
  attendanceData: EmployeeAttendanceType
) => {
  const validatedData = EmployeeAttendanceSchema.parse(attendanceData);
  const attendance = new EmployeeAttendance(validatedData);
  return await attendance.save();
};

export const getAllAttendanceRecords = async () => {
  return await EmployeeAttendance.find();
};

export const getAttendanceById = async (id: string) => {
  return await EmployeeAttendance.findById(id);
};

export const updateAttendanceRecord = async (
  id: string,
  attendanceData: Partial<EmployeeAttendanceType>
) => {
  const validatedData =
    EmployeeAttendanceSchema.partial().parse(attendanceData);
  return await EmployeeAttendance.findByIdAndUpdate(id, validatedData, {
    new: true,
  });
};

export const deleteAttendanceRecord = async (id: string) => {
  return await EmployeeAttendance.findByIdAndDelete(id);
};
