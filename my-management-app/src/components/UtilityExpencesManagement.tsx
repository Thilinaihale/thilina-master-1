// src/components/UtilityExpensesManagement.tsx
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
  getAllUtilityExpenses,
  createUtilityExpense,
  updateUtilityExpense,
  deleteUtilityExpense,
} from "../api/utilityExpenseService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import { UtilityExpense, UtilityExpenseSchema, UtilityExpenseType } from "../models/UtilityExpenseModel";
import moment from "moment";

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip);

const { Search } = Input;

const UtilityExpensesManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<UtilityExpense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<UtilityExpense[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<UtilityExpense | null>(null);
  const [showTotalAmount, setShowTotalAmount] = useState<boolean>(false); // State for showing total amount

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await getAllUtilityExpenses();
      setExpenses(response);
      setFilteredExpenses(response);
    } catch (error) {
      message.error("Failed to load utility expenses.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const expense: UtilityExpenseType = {
        type: values.type,
        amount: parseFloat(values.amount),
        date: values.date.toDate(),
        description: values.description,
      };

      UtilityExpenseSchema.parse(expense);

      if (editingRecord) {
        await updateUtilityExpense(editingRecord._id, expense);
        message.success("Utility expense updated successfully!");
      } else {
        await createUtilityExpense(expense);
        message.success("Utility expense created successfully!");
      }

      form.resetFields();
      fetchExpenses();
      setEditingRecord(null);
      setModalOpened(false);
    } catch (error: any) {
      if (error instanceof Error) {
        message.error(`Failed to save utility expense: ${error.message}`);
      } else {
        message.error("Failed to save utility expense due to an unknown error.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: UtilityExpense) => {
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
      await deleteUtilityExpense(id);
      message.success("Utility expense deleted successfully!");
      fetchExpenses();
    } catch (error) {
      message.error("Failed to delete utility expense.");
    } finally {
      setLoading(false);
    }
  };

  const generateEnhancedReport = (expenses: UtilityExpense[]) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Utility Expenses Detailed Report', 14, 15);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 23);
  
    // Summary Statistics
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgExpense = totalExpense / expenses.length;
    const maxExpense = Math.max(...expenses.map(exp => exp.amount));
    const minExpense = Math.min(...expenses.map(exp => exp.amount));
  
    doc.setFontSize(14);
    doc.text('Summary Statistics', 14, 35);
    doc.setFontSize(10);
    doc.text(`Total Expenses: $${totalExpense.toFixed(2)}`, 14, 43);
    doc.text(`Average Expense: $${avgExpense.toFixed(2)}`, 14, 51);
    doc.text(`Highest Expense: $${maxExpense.toFixed(2)}`, 14, 59);
    doc.text(`Lowest Expense: $${minExpense.toFixed(2)}`, 14, 67);
  
    // Expense Breakdown by Type
    const expenseByType = expenses.reduce((acc, exp) => {
      acc[exp.type] = (acc[exp.type] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);
  
    doc.setFontSize(14);
    doc.text('Expense Breakdown by Type', 14, 80);
    doc.setFontSize(10);
    let yOffset = 88;
    Object.entries(expenseByType).forEach(([type, amount]) => {
      doc.text(`${type}: $${amount.toFixed(2)}`, 14, yOffset);
      yOffset += 8;
    });
  
    // Detailed Expense Table
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Detailed Expense List', 14, 15);
    
    const tableColumn = ["Type", "Amount ($)", "Date", "Description"];
    const tableRows = expenses.map((expense) => [
      expense.type,
      expense.amount.toFixed(2),
      new Date(expense.date).toLocaleDateString(),
      expense.description || "",
    ]);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });
  
    // Expenses Over Time (Table format instead of chart)
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Expenses Over Time', 14, 15);
  
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const timeSeriesData = sortedExpenses.map(exp => [
      new Date(exp.date).toLocaleDateString(),
      exp.type,
      exp.amount.toFixed(2)
    ]);
  
    doc.autoTable({
      head: [['Date', 'Type', 'Amount ($)']],
      body: timeSeriesData,
      startY: 25,
    });
  
    // Expense Distribution by Type (Table format instead of pie chart)
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Expense Distribution by Type', 14, 15);
  
    const distributionData = Object.entries(expenseByType).map(([type, amount]) => [
      type,
      amount.toFixed(2),
      ((amount / totalExpense) * 100).toFixed(2) + '%'
    ]);
  
    doc.autoTable({
      head: [['Type', 'Total Amount ($)', 'Percentage']],
      body: distributionData,
      startY: 25,
    });
  
    // Save the PDF
    doc.save('enhanced_utility_expenses_report.pdf');
  };

  const handleSearch = (value: string) => {
    const filtered = expenses.filter((expense) =>
      expense.type.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredExpenses(filtered);
  };

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0); // Calculate total amount

  const columns = [
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: UtilityExpense) => (
        <span>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8, backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Green edit button
            className="animate-button"
          />
          <Popconfirm
            title="Are you sure to delete this expense?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button 
              className="danger-button animate-button" // Add a class for custom danger styling
              type="primary" // Use primary or another valid type
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
      }} // Background image and opacity adjustment
    >
      <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <h1>Utility Expenses Management</h1>
        <Search
          placeholder="Search by type"
          onSearch={handleSearch}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setModalOpened(true)}
          style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Green add button
          className="animate-button" // Add animation class for smooth hover effects
        >
          Add Utility Expense
        </Button>
        <Button
          style={{ float: 'right' }}
          icon={<FileTextOutlined />}
          onClick={() => generateEnhancedReport(filteredExpenses)}
        >
          Generate Enhanced Report
        </Button>
        <Button
          type="default"
          onClick={() => setShowTotalAmount((prev) => !prev)} // Toggle total amount visibility
          style={{ marginLeft: 8 }}
        >
          {showTotalAmount ? "Hide Total Amount" : "Show Total Amount"}
        </Button>
        {showTotalAmount && (
          <h2 style={{ marginTop: 16 }}>Total Amount: ${totalAmount.toFixed(2)}</h2> // Display total amount
        )}
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={filteredExpenses} rowKey="_id" />
        </Spin>
      </Card>

      {/* Modal */}
      <Modal
        title={editingRecord ? "Edit Utility Expense" : "Add Utility Expense"}
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
          initialValues={{ type: "", amount: 0, date: moment(), description: "" }}
        >
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please enter the utility type" }]}
          >
            <Select>
              <Select.Option value="Electricity">Electricity</Select.Option>
              <Select.Option value="Water">Water</Select.Option>
              <Select.Option value="Internet">Internet</Select.Option>
              <Select.Option value="Gas">Gas</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter the amount" }]}
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
          <Form.Item name="description" label="Description">
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

export default UtilityExpensesManagement;
