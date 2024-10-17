// src/components/UserManagement.tsx
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
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { User, UserSchema, UserType } from "../models/UserModel";

const { Search } = Input;
const { Option } = Select;

const UserManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response);
      setFilteredUsers(response);
    } catch (error) {
      message.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const user: UserType = {
        firstName: values.firstName,
        lastName: values.lastName,
        type: values.type,
        phone: values.phone,
        email: values.email,
        password: values.password,
        address: values.address,
      };

      UserSchema.parse(user);

      if (editingRecord) {
        await updateUser(editingRecord._id, user);
        message.success("User updated successfully!");
      } else {
        await createUser(user);
        message.success("User created successfully!");
      }

      form.resetFields();
      fetchUsers();
      setEditingRecord(null);
      setModalOpened(false);
    } catch (error: any) {
      if (error instanceof Error) {
        message.error(`Failed to save user: ${error.message}`);
      } else {
        message.error("Failed to save user due to an unknown error.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: User) => {
    form.setFieldsValue({
      ...record,
      password: undefined, // Don't set password when editing
    });
    setEditingRecord(record);
    setModalOpened(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteUser(id);
      message.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "First Name",
      "Last Name",
      "Type",
      "Phone",
      "Email",
      "Address",
    ];
    const tableRows = filteredUsers.map((user) => [
      user.firstName,
      user.lastName,
      user.type,
      user.phone,
      user.email,
      user.address,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("User Report", 14, 15);
    doc.save("user_report.pdf");
  };

  const handleSearch = (value: string) => {
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(value.toLowerCase()) ||
        user.lastName.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: User) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
            style={{ color: '#4CAF50' }} // Green color for edit button
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              style={{ color: 'red' }} // Red color for delete button
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
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.9,
      }}
    >
      <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px' }}>
        <h1>User Management</h1>
        <Search
          placeholder="Search by name or email"
          onSearch={handleSearch}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpened(true)}
          style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Green add button
        >
          Add User
        </Button>
        <Button
          style={{ float: 'right' }}
          icon={<FileTextOutlined />}
          onClick={generateReport}
        >
          Generate Report
        </Button>
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={filteredUsers} rowKey="_id" />
        </Spin>
      </Card>

      {/* Modal */}
      <Modal
        title={editingRecord ? "Edit User" : "Add User"}
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
          initialValues={{
            firstName: "",
            lastName: "",
            type: "User",
            phone: "",
            email: "",
            password: "",
            address: "",
          }}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter the first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter the last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="User Type"
            rules={[{ required: true, message: "Please select the user type" }]}
          >
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter the phone number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the email" }, { type: 'email', message: 'Invalid email' }]}
          >
            <Input />
          </Form.Item>
          {!editingRecord && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter the password" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter the address" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Green submit button
            >
              {editingRecord ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
