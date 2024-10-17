import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Popconfirm,
  message,
  Spin,
  Modal,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  getAllAttendanceRecords,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
} from "../api/employeeAttendanceService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { EmployeeAttendance } from "../models/EmployeeAttendanceModel";
import { Employee } from "../models/EmpoyeeModel";
import { getAllEmployees } from "../api/employeeService";

const { Search } = Input;

const EmployeeAttendanceManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [attendances, setAttendances] = useState<EmployeeAttendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<
    EmployeeAttendance[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EmployeeAttendance | null>(
    null
  );

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const [response, employees] = await Promise.all([
        getAllAttendanceRecords(),
        getAllEmployees(),
      ]);
      setAttendances(response);
      setEmployees(employees);
      setFilteredAttendances(response);
    } catch (error) {
      message.error("Failed to load attendances.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const attendance = {
        employeeId: values.employeeId,
        arrivalTime: values.arrivalTime,
        departureTime: values.departureTime,
        shiftType: values.shiftType,
      };

      if (editingRecord) {
        await updateAttendanceRecord(editingRecord._id, attendance);
        message.success("Attendance updated successfully!");
      } else {
        await createAttendanceRecord(attendance);
        message.success("Attendance created successfully!");
      }

      form.resetFields();
      fetchAttendances();
      setEditingRecord(null);
      setModalOpened(false);
    } catch (error) {
      message.error("Failed to save attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: EmployeeAttendance) => {
    form.setFieldsValue(record);
    setEditingRecord(record);
    setModalOpened(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteAttendanceRecord(id);
      message.success("Attendance deleted successfully!");
      fetchAttendances();
    } catch (error) {
      message.error("Failed to delete attendance.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Employee ID",
      "Arrival Time",
      "Departure Time",
      "Shift Type",
    ];
    const tableRows = filteredAttendances.map((attendance) => [
      attendance.employeeId,
      attendance.arrivalTime,
      attendance.departureTime,
      attendance.shiftType,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("Attendance Report", 14, 15);
    doc.save("attendance_report.pdf");
  };

  const handleSearch = (value: string) => {
    const filtered = attendances.filter((attendance) =>
      attendance.employeeId.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAttendances(filtered);
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    { title: "Arrival Time", dataIndex: "arrivalTime", key: "arrivalTime" },
    {
      title: "Departure Time",
      dataIndex: "departureTime",
      key: "departureTime",
    },
    { title: "Shift Type", dataIndex: "shiftType", key: "shiftType" },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: EmployeeAttendance) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
          />
          <Popconfirm
            title="Are you sure you want to delete this attendance?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('/station-bg.jpg')", // Update with your background image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.9,
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            width: "80%",
            maxWidth: "1200px",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            Employee Attendance Management
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <Search
              placeholder="Search by Employee ID"
              onSearch={handleSearch}
              style={{ width: 250 }}
            />
            <div>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setModalOpened(true)}
                style={{ marginRight: 8 }}
              >
                Create Attendance
              </Button>
              <Button
                icon={<FileTextOutlined />}
                onClick={generateReport}
                type="primary"
              >
                Generate Report
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredAttendances}
            rowKey="_id"
          />
        </div>
        <Modal
          title={editingRecord ? "Edit Attendance" : "Create Attendance"}
          open={modalOpened}
          onCancel={() => setModalOpened(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[
                { required: true, message: "Please input the employee ID!" },
              ]}
            >
              <Select>
                {employees.map((employee) => (
                  <Select.Option key={employee._id} value={employee._id}>
                    {employee.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="arrivalTime"
              label="Arrival Time"
              rules={[
                { required: true, message: "Please input the arrival time!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="departureTime"
              label="Departure Time"
              rules={[
                { required: true, message: "Please input the departure time!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="shiftType"
              label="Shift Type"
              rules={[
                { required: true, message: "Please select the shift type!" },
              ]}
            >
              <Select>
                <Select.Option value="over_time">Over Time</Select.Option>
                <Select.Option value="in_time">In Time</Select.Option>
                <Select.Option value="half_time">Half Time</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {editingRecord ? "Update Attendance" : "Create Attendance"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default EmployeeAttendanceManagement;
