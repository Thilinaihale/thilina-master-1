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
  DatePicker,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  getAllSalaries,
  createSalary,
  updateSalary,
  deleteSalary,
} from "../api/salaryService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Salary, SalarySchema, SalaryType } from "../models/SalaryModel";
import moment from "moment";

const { Search } = Input;

const SalaryManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [filteredSalaries, setFilteredSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Salary | null>(null);

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await getAllSalaries();
      setSalaries(response);
      setFilteredSalaries(response);
    } catch (error) {
      message.error("Failed to load salaries.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const date: Date = values.date ? moment(values.date).toDate() : new Date();
      const salary: SalaryType = {
        name: values.name,
        basePay: parseFloat(values.basePay),
        bonus: parseFloat(values.bonus),
        totalPay: parseFloat(values.basePay) + parseFloat(values.bonus),
        workDays: parseInt(values.workDays),
        date: date,
        phone: values.phone,
      };

      SalarySchema.parse(salary);

      if (editingRecord) {
        await updateSalary(editingRecord._id!, salary);
        message.success("Salary updated successfully!");
      } else {
        await createSalary(salary);
        message.success("Salary created successfully!");
      }

      form.resetFields();
      fetchSalaries();
      setEditingRecord(null);
      setModalOpened(false);
    } catch (error: any) {
      if (error instanceof Error) {
        message.error(`Failed to save salary: ${error.message}`);
      } else {
        message.error("Failed to save salary due to an unknown error.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Salary) => {
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
    setEditingRecord(record);
    setModalOpened(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteSalary(id);
      message.success("Salary deleted successfully!");
      fetchSalaries();
    } catch (error) {
      message.error("Failed to delete salary.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Name",
      "Base Pay",
      "Bonus",
      "Total Pay",
      "Work Days",
      "Date",
      "Phone",
    ];
    const tableRows = filteredSalaries.map((salary) => [
      salary.name,
      salary.basePay,
      salary.bonus,
      salary.totalPay,
      salary.workDays,
      new Date(salary.date).toLocaleDateString(),
      salary.phone,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("Salary Report", 14, 15);
    doc.save("salary_report.pdf");
  };

  const handleSearch = (value: string) => {
    const filtered = salaries.filter((salary) =>
      salary.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSalaries(filtered);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Base Pay", dataIndex: "basePay", key: "basePay" },
    { title: "Bonus", dataIndex: "bonus", key: "bonus" },
    { title: "Total Pay", dataIndex: "totalPay", key: "totalPay" },
    { title: "Work Days", dataIndex: "workDays", key: "workDays" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Salary) => (
        <span>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8, backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Green edit button
          />
          <Popconfirm
            title="Are you sure to delete this salary?"
            onConfirm={() => handleDelete(record._id!)}
          >
            <Button
              type="primary"
              danger
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
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.9
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          width: '80%',
          maxWidth: '1000px'
        }}
      >
        <h1>Salary Management</h1>
        <Search
          placeholder="Search by name"
          onSearch={handleSearch}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpened(true)}
          style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Green add button
        >
          Add Salary
        </Button>
        <Button
          style={{ float: 'right' }}
          icon={<FileTextOutlined />}
          onClick={generateReport}
        >
          Generate Report
        </Button>
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={filteredSalaries} rowKey="_id" />
        </Spin>
      </div>

      {/* Modal */}
      <Modal
        title={editingRecord ? "Edit Salary" : "Add Salary"}
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
          initialValues={{ name: "", basePay: 0, bonus: 0, workDays: 0, date: moment(), phone: "" }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the employee name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="basePay"
            label="Base Pay"
            rules={[{ required: true, message: "Please enter the base pay" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="bonus"
            label="Bonus"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="workDays"
            label="Work Days"
            rules={[{ required: true, message: "Please enter the number of work days" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
          >
            <Input />
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

export default SalaryManagement;
