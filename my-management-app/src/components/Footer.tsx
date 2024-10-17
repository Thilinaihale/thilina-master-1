// Footer.tsx
import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #f0f0f0;
  padding: 1rem;
  text-align: center;
`;

const Address = styled.p`
  margin-bottom: 0.5rem;
`;

const PhoneNumber = styled.p`
  margin-bottom: 0.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SocialLink = styled.a`
  color: #000;
  text-decoration: none;
  font-size: 1.5rem;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Address>lanka fuelling station kandy road nikilogaskada</Address>
      <PhoneNumber>081-xxxxxxxx</PhoneNumber>
      <SocialLinks>
        <SocialLink href="#" aria-label="Facebook">
          <i className="fab fa-facebook"></i>
        </SocialLink>
        <SocialLink href="#" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </SocialLink>
        <SocialLink href="#" aria-label="Twitter">
          <i className="fab fa-twitter"></i>
        </SocialLink>
      </SocialLinks>
    </FooterContainer>
  );
};

export default Footer;
