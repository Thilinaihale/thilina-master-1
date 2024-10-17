import Employee, { EmployeeType, EmployeeSchema } from "../models/Employee";

export const createEmployee = async (employeeData: EmployeeType) => {
  const validatedData = EmployeeSchema.parse(employeeData);
  const employee = new Employee(validatedData);
  return await employee.save();
};

export const getAllEmployees = async () => {
  return await Employee.find();
};

export const getEmployeeById = async (id: string) => {
  return await Employee.findById(id);
};

export const updateEmployee = async (
  id: string,
  employeeData: Partial<EmployeeType>
) => {
  const validatedData = EmployeeSchema.partial().parse(employeeData);
  return await Employee.findByIdAndUpdate(id, validatedData, { new: true });
};

export const deleteEmployee = async (id: string) => {
  return await Employee.findByIdAndDelete(id);
};
