// Logo.tsx
import React from "react";
import styled from "styled-components";

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
`;

const LogoText = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  margin-left: 0.5rem;
`;

const Logo: React.FC = () => {
  return (
    <LogoContainer>
      <LogoImage src="/path-to-logo.png" alt="Ruchira Lanka Fuelling Station" />
      <LogoText>RUCHIRA LANKA FUELLING STATION</LogoText>
    </LogoContainer>
  );
};

export default Logo;
