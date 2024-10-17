// DashboardButton.tsx
import React from "react";
import styled from "styled-components";

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

interface DashboardButtonProps {
  label: string;
  onClick?: () => void;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  label,
  onClick,
}) => {
  return <Button onClick={onClick}>{label}</Button>;
};

export default DashboardButton;
