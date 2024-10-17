import { SearchOutlined } from "@ant-design/icons";
import { Input, Space, Layout } from "antd";
import Title from "antd/es/typography/Title";
import styled from "styled-components";
const { Header } = Layout;
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

const HeaderComponent = () => {
  return (
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
  );
};

export default HeaderComponent;
