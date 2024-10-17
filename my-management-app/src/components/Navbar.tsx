import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Space } from "antd";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  background-color: #1890ff;
  padding: 10px 0;
`;

const NavLink = styled(Link)`
  color: white;
  &:hover {
    color: #e6f7ff;
  }
`;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <NavbarContainer>
      <Space size={20}>
        <NavLink to="/">HOME</NavLink>
        <NavLink to="/vehicle-wash">Vehicle Wash</NavLink>
        <NavLink to="/appointments">Appointments</NavLink>
        <NavLink to="/about">About Us</NavLink>
        {localStorage.getItem("fuelUser") && (
          <NavLink
            to="/logout"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Log out
          </NavLink>
        )}
      </Space>
    </NavbarContainer>
  );
};

export default Navbar;
