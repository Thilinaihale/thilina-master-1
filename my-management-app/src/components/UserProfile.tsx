// UserProfile.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Popconfirm,
  Modal,
  Typography,
} from "antd";
import HeaderComponent from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { User, UserType } from "../models/UserModel";
import { getUserById, updateUser, deleteUser } from "../api/userService";

const { Title, Text } = Typography;

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  min-height: 65vh;
`;

const StyledCard = styled(Card)`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const Container = styled.div`
  background-image: url("station-bg.jpg");
`;

const UserProfile: React.FC = () => {
  const { id } = JSON.parse(
    localStorage.getItem("fuelUser")?.toString() ?? {}.toString()
  );
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [user, setUser] = useState<User | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const userData = await getUserById(id);
          setUser(userData);
          form.setFieldsValue(userData);
        } catch (error) {
          message.error("Failed to fetch user data");
        }
      }
    };
    fetchUser();
  }, [id, form]);

  const handleUpdate = async (values: Partial<UserType>) => {
    if (id) {
      try {
        const updatedUser = await updateUser(id, values);
        setUser(updatedUser);
        message.success("User profile updated successfully");
        setIsEditModalVisible(false);
      } catch (error) {
        message.error("Failed to update user profile");
      }
    }
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteUser(id);
        message.success("User profile deleted successfully");
        navigate("/"); // Redirect to home page or user list
      } catch (error) {
        message.error("Failed to delete user profile");
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <HeaderComponent />
      <Navbar />
      <ProfileContainer>
        <StyledCard
          title={<Title level={2}>User Profile</Title>}
          extra={
            <Button type="primary" onClick={() => setIsEditModalVisible(true)}>
              Edit Profile
            </Button>
          }
        >
          <InfoItem>
            <Text strong>First Name: </Text>
            <Text>{user.firstName}</Text>
          </InfoItem>
          <InfoItem>
            <Text strong>Last Name: </Text>
            <Text>{user.lastName}</Text>
          </InfoItem>
          <InfoItem>
            <Text strong>Email: </Text>
            <Text>{user.email}</Text>
          </InfoItem>
          <InfoItem>
            <Text strong>Phone: </Text>
            <Text>{user.phone}</Text>
          </InfoItem>
          <InfoItem>
            <Text strong>Address: </Text>
            <Text>{user.address}</Text>
          </InfoItem>
          <ButtonContainer>
            <Popconfirm
              title="Are you sure you want to delete your profile?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete Profile</Button>
            </Popconfirm>
          </ButtonContainer>
        </StyledCard>
      </ProfileContainer>
      <Footer />

      <Modal
        title="Edit Profile"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={user}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: /^\+?[1-9]\d{1,14}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default UserProfile;
