import React, { useState } from "react";
import { Input, Button, Layout, Typography, Space, Form, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterComponent from "./Footer";
import { createUser } from "../api/userService";
import { UserType } from "../models/UserModel";

const { Header, Content } = Layout;
const { Title } = Typography;
interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  phone: string;
  address: string;
}

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background-image: url("station-bg.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const StyledHeader = styled(Header)`
  background-color: #000;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  width: 50px;
  height: 50px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const StyledContent = styled(Content)`
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  phone: string;
  address: string;
}

const RuchiraLankaSignup: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const onFinish = async (values: FormValues) => {
    if (values.password !== values.confirm) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const user: UserType = {
        firstName: values.firstName,
        lastName: values.lastName,
        address: values.address,
        password: values.password,
        phone: values.phone,
        email: values.email,
        type: "user",
      };
      await createUser(user);
      message.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      message.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <Space>
          <Logo>
            <img
              src="fuel-logo.png"
              alt="Ruchira Lanka Logo"
              width="40"
              height="40"
            />
          </Logo>
          <Title level={4} style={{ color: "white", margin: 0 }}>
            RUCHIRA LANKA FUELLING STATION
          </Title>
        </Space>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
      </StyledHeader>
      <Navbar />
      <StyledContent>
        <Form<FormValues>
          form={form}
          onFinish={(values) => {
            onFinish(values as FormValues);
          }}
        >
          <Title
            level={3}
            style={{ color: "white", textAlign: "center", marginBottom: 20 }}
          >
            SIGN UP
          </Title>
          <Title level={5} style={{ color: "white", marginBottom: 20 }}>
            Create your account
          </Title>
          <Form.Item
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            name="address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input.TextArea placeholder="Address" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            rules={[
              { required: true, message: "Please confirm your password!" },
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign up
            </Button>
          </Form.Item>
          <div
            style={{ textAlign: "center", color: "white", marginBottom: 10 }}
          >
            Already have an account?
          </div>
          <Button block>
            <Link to="/login">Sign in now</Link>
          </Button>
        </Form>
      </StyledContent>
      <FooterComponent />
    </StyledLayout>
  );
};

export default RuchiraLankaSignup;
