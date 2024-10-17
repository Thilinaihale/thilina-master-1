import React, { useState } from "react";
import { Input, Button, Layout, Typography, Space, Form, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterComponent from "./Footer";
import { loginUser } from "../api/userService";

const { Header, Content } = Layout;
const { Title } = Typography;

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

const LoginForm = styled(Form)`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 8px;
  width: 300px;
`;

const RuchiraLankaLogin: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await loginUser(values.username, values.password);
      const user = response.user;
      localStorage.setItem("fuelUser", JSON.stringify(user));
      message.success("Login successful!");

      if (user?.type === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      message.error(
        "Login failed. Please check your credentials and try again."
      );
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
        <LoginForm
          form={form}
          onFinish={(values: any) => {
            onFinish(values);
          }}
        >
          <Title
            level={3}
            style={{ color: "white", textAlign: "center", marginBottom: 20 }}
          >
            SIGN IN
          </Title>

          <Title level={5} style={{ color: "white", marginBottom: 20 }}>
            Login to your account
          </Title>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Link
            to="/forgot-password"
            style={{ color: "white", display: "block", marginBottom: 10 }}
          >
            Forget Your Password?
          </Link>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign in
            </Button>
          </Form.Item>
          <div
            style={{ textAlign: "center", color: "white", marginBottom: 10 }}
          >
            Need an account
          </div>
          <Button block>
            <Link to="/signup">Sign up now</Link>
          </Button>
        </LoginForm>
      </StyledContent>
      <FooterComponent />
    </StyledLayout>
  );
};

export default RuchiraLankaLogin;
