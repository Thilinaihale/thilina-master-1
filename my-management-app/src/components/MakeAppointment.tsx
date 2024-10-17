import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
  message,
  Col,
  Row,
} from "antd";
import HeaderComponent from "./Header";
import Navbar from "./Navbar";
import { AppointmentType } from "../models/Appointment";
import {
  createAppointment,
  getAllAppointments,
} from "../api/appointmentService";
import moment, { Moment } from "moment";
import { Dayjs } from "dayjs";
const Container = styled.div`
  background-image: url("station-bg.jpg");
  padding: 20px;
  min-height: 100vh;
  background-size: cover;
`;

const { Option } = Select;

const MakeAppointment: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Slot options
  const slotOptions = ["Slot 1", "Slot 2", "Slot 3", "Slot 4", "Slot 5"];

  const fetchAppointments = async () => {
    try {
      const res = await getAllAppointments();
      setAppointments(res);
    } catch (error) {
      console.error(`Error fetching appointments: ${error}`);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter out slots that are already booked for the selected date and time
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const bookedSlots = appointments
        .filter(
          (appointment) =>
            moment(appointment.date).format("YYYY-MM-DD") === selectedDate &&
            appointment.time === selectedTime
        )
        .map((appointment) => appointment.slotNumber);

      const freeSlots = slotOptions.filter(
        (slot) => !bookedSlots.includes(slot)
      );
      setAvailableSlots(freeSlots);
    } else {
      setAvailableSlots(slotOptions); // Show all slots if no date/time is selected
    }
  }, [selectedDate, selectedTime, appointments, slotOptions]);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      await createAppointment({ ...values, date: new Date(values.date) });

      message.success("Appointment created successfully!");
      form.resetFields();
    } catch (error) {
      message.error("Error creating appointment.");
    }
  };

  return (
    <Container>
      <HeaderComponent />
      <Navbar />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Row>
          <Col span={10}>
            <Form.Item
              label="Car Number"
              name="carNumber"
              rules={[
                { required: true, message: "Please enter your car number" },
              ]}
            >
              <Input placeholder="Enter your car number" />
            </Form.Item>
          </Col>
          <Col span={4} />
          <Col span={10}>
            <Form.Item
              label="Car Type"
              name="carType"
              rules={[
                { required: true, message: "Please enter your car type" },
              ]}
            >
              <Input placeholder="Enter your car type" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Vehicle Type"
          name="vehicleType"
          rules={[
            { required: true, message: "Please enter your vehicle type" },
          ]}
        >
          <Input placeholder="Enter your vehicle type" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            onChange={(date: Moment | null) =>
              setSelectedDate(date ? date.format("YYYY-MM-DD") : undefined)
            }
          />
        </Form.Item>

        <Form.Item
          label="Time"
          name="time"
          rules={[{ required: true, message: "Please select a time" }]}
        >
          <TimePicker
            format="HH:mm"
            onChange={(time: Dayjs | null) =>
              setSelectedTime(time ? time.format("HH:mm") : undefined)
            }
          />
        </Form.Item>

        <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[
            { required: true, message: "Please select a payment method" },
          ]}
        >
          <Select placeholder="Select payment method">
            <Option value="cash">Cash</Option>
            <Option value="card">Card</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Slot Number"
          name="slotNumber"
          rules={[{ required: true, message: "Please select a slot" }]}
        >
          <Select placeholder="Select a slot">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <Option key={index} value={slot}>
                  {slot}
                </Option>
              ))
            ) : (
              <Option value="" disabled>
                No available slots
              </Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Make Appointment
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default MakeAppointment;
