// BackgroundImage.tsx
import React from "react";
import styled from "styled-components";

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/station-bg.jpg");
  background-size: cover;
  background-position: center;
  opacity: 0.8;
  z-index: -1;
`;

const BackgroundImage: React.FC = () => {
  return <Background />;
};

export default BackgroundImage;
