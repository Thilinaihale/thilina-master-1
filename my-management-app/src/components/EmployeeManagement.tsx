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
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employeeService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Employee, EmployeeSchema, EmployeeType } from "../models/EmpoyeeModel";

const { Search } = Input;

const EmployeeManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Employee | null>(null);
  const [showTotalCount, setShowTotalCount] = useState<boolean>(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getAllEmployees();
      setEmployees(response);
      setFilteredEmployees(response);
    } catch (error) {
      message.error("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const employee: EmployeeType = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        nicNumber: values.nic,
        address: values.address,
      };

      EmployeeSchema.parse(employee);

      if (editingRecord) {
        await updateEmployee(editingRecord._id, employee);
        message.success("Employee updated successfully!");
      } else {
        await createEmployee(employee);
        message.success("Employee created successfully!");
      }

      form.resetFields();
      fetchEmployees();
      setEditingRecord(null);
      setModalOpened(false);
    } catch (error: any) {
      message.error(`Failed to save employee: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Employee) => {
    form.setFieldsValue({
      ...record,
      nic: record.nicNumber,
    });
    setEditingRecord(record);
    setModalOpened(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteEmployee(id);
      message.success("Employee deleted successfully!");
      fetchEmployees();
    } catch (error) {
      message.error("Failed to delete employee.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Email", "Phone", "NIC"];
    const tableRows = filteredEmployees.map((employee) => [
      employee.name,
      employee.email,
      employee.phone,
      employee.nicNumber,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("Employee Report", 14, 15);
    doc.save("employee_report.pdf");
  };

  const handleSearch = (value: string) => {
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const totalEmployees = filteredEmployees.length;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Employee, b: Employee) => a.name.localeCompare(b.name),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "NIC Number",
      dataIndex: "nicNumber",
      key: "nicNumber",
    },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Employee) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8, backgroundColor: "#4CAF50", borderColor: "#4CAF50" }} // Green edit button
            className="animate-button"
          />
          <Popconfirm
            title="Are you sure to delete this employee?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              className="danger-button animate-button"
              type="primary"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/station-bg.jpg')", // Background image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.9,
      }}
    >
      <Card style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
        <h1>Employee Management</h1>
        <Search
          placeholder="Search by name"
          onSearch={handleSearch}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpened(true)}
          style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }} // Green add button
          className="animate-button"
        >
          Add Employee
        </Button>
        <Button
          style={{ float: "right" }}
          icon={<FileTextOutlined />}
          onClick={generateReport}
        >
          Generate Report
        </Button>
        <Button
          type="default"
          onClick={() => setShowTotalCount((prev) => !prev)} // Toggle total employee count
          style={{ marginLeft: 8 }}
        >
          {showTotalCount ? "Hide Total Employees" : "Show Total Employees"}
        </Button>
        {showTotalCount && (
          <h2 style={{ marginTop: 16 }}>Total Employees: {totalEmployees}</h2>
        )}
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={filteredEmployees} rowKey="_id" />
        </Spin>
      </Card>

      {/* Modal */}
      <Modal
        title={editingRecord ? "Edit Employee" : "Add Employee"}
        open={modalOpened}
        onCancel={() => {
          form.resetFields();
          setModalOpened(false);
          setEditingRecord(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ name: "", email: "", phone: "", nic: "", address: "" }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the employee's name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the employee's email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter the employee's phone" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nic"
            label="NIC Number"
            rules={[{ required: true, message: "Please enter the employee's NIC number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }} // Green submit button
            >
              {editingRecord ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
