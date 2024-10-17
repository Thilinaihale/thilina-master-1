// UserDashboard.tsx
import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import DashboardButton from "./DashboardButton";
import BackgroundImage from "./BackgroundImage";
import HeaderComponent from "./Header";
import { useNavigate } from "react-router-dom";
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  position: relative;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
`;

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <DashboardContainer>
      <HeaderComponent />
      <Navbar />
      <Content>
        <BackgroundImage />
        <SearchBar />
        <h1>Home page</h1>
        <ButtonContainer>
          {localStorage.getItem("fuelUser") ? (
            <DashboardButton
              label="My Account"
              onClick={() => {
                navigate("/profile");
              }}
            />
          ) : (
            <DashboardButton
              label="Login"
              onClick={() => {
                navigate("/login");
              }}
            />
          )}
          <DashboardButton label="Vehicle Registration" />
          <DashboardButton
            onClick={() => {
              navigate("/appointments");
            }}
            label="Appointment"
          />
          <DashboardButton label="Payment" />
        </ButtonContainer>
      </Content>
      <Footer />
    </DashboardContainer>
  );
};

export default UserDashboard;
