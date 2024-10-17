import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import {
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
} from "../api/appointmentService";
import { AppointmentType } from "../models/Appointment";

const { Option } = Select;

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [editingAppointment, setEditingAppointment] =
    useState<AppointmentType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState(""); // State for search
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (error) {
      message.error("Error fetching appointments");
    }
  };

  // Handle Edit button click
  const handleEdit = (appointment: AppointmentType) => {
    setEditingAppointment(appointment);
    setIsModalVisible(true);
    form.setFieldsValue({
      serviceType: appointment.serviceType,
      status: appointment.status,
      price: appointment.price,
    });
  };

  // Handle form submission for updating
  const handleUpdate = async () => {
    try {
      const updatedValues = await form.validateFields();
      await updateAppointment(editingAppointment?._id! || "", {
        ...updatedValues,
        price: parseFloat(updatedValues.price),
      });
      message.success("Appointment updated successfully!");
      setIsModalVisible(false);
      fetchAppointments();
    } catch (error) {
      message.error("Error updating appointment");
    }
  };

  // Handle delete appointment
  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);
      message.success("Appointment deleted successfully!");
      fetchAppointments();
    } catch (error) {
      message.error("Error deleting appointment");
    }
  };

  // Handle search
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.carNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Appointments Report", 20, 10);

    const tableColumn = [
      "Car Number",
      "Car Type",
      "Vehicle Type",
      "Payment Method",
      "Date",
      "Time",
      "Slot Number",
      "Service Type",
      "Status",
      "Price",
    ];

    const tableRows = appointments.map((appointment) => [
      appointment.carNumber,
      appointment.carType,
      appointment.vehicleType,
      appointment.paymentMethod,
      appointment.date,
      appointment.time,
      appointment.slotNumber,
      appointment.serviceType,
      appointment.status,
      appointment.price,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("appointments_report.pdf");
  };

  const columns = [
    {
      title: "Car Type",
      dataIndex: "carType",
      key: "carType",
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: any) => {
        return moment(date).format("YYYY-MM-DD");
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time: any) => {
        return moment(time, "HH:mm").format("HH:mm");
      },
    },
    {
      title: "Slot Number",
      dataIndex: "slotNumber",
      key: "slotNumber",
    },
    {
      title: "Car Number",
      dataIndex: "carNumber",
      key: "carNumber",
    },
    {
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: AppointmentType) => (
        <>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => handleEdit(record)}
            style={{
              marginRight: 8,
              backgroundColor: "#4CAF50",
              borderColor: "#4CAF50",
            }}
          />
          <Popconfirm
            title="Are you sure to delete this appointment?"
            onConfirm={() => handleDelete(record._id!)}
          >
            <Button icon={<DeleteOutlined />} danger type="primary" />
          </Popconfirm>
        </>
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
        backgroundImage: "url('/station-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.9,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 20,
          borderRadius: 8,
        }}
      >
        <h1>Appointment Management</h1>
        <Input
          placeholder="Search by Car Number"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          style={{
            backgroundColor: "#4CAF50",
            borderColor: "#4CAF50",
            marginBottom: 16,
          }}
        >
          Add Appointment
        </Button>
        <Button
          type="default"
          icon={<FilePdfOutlined />}
          onClick={generatePDF}
          style={{ marginLeft: 16 }}
        >
          Generate Report
        </Button>

        <Table columns={columns} dataSource={filteredAppointments} rowKey="_id" />
      </div>

      <Modal
        title={editingAppointment ? "Edit Appointment" : "Add Appointment"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAppointment(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            name="serviceType"
            label="Service Type"
            rules={[{ required: true, message: "Please enter the service type" }]}
          >
            <Select>
              <Option value="Oil Change">Oil Change</Option>
              <Option value="Tire Rotation">Tire Rotation</Option>
              <Option value="Brake Inspection">Brake Inspection</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter the price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
            >
              {editingAppointment ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentManagement;