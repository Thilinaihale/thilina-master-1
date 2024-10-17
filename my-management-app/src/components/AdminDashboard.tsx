import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  MoneyCollectOutlined,
  MoneyCollectFilled,
  UserOutlined,
} from "@ant-design/icons";
import "../App.css";
import SalaryManagement from "./SalaryManagement";

import UtilityExpencesManagement from "./UtilityExpencesManagement";
import UserManagement from "./UserManagement";
import EmployeeManagement from "./EmployeeManagement";
import EmployeeAttendanceManagement from "./EmployeeAttendanceManagement";
import InventoryAndSales from "./InventoryAndSales";
import Appointment from "./Appointment";

const { Content, Sider } = Layout;

const AdminDashboard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(1);

  const onMenuItemClicked = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <Layout>
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%", borderRight: 0 }}
            theme="light" // Set the theme to light
          >
            <Menu.Item
              onClick={() => {
                onMenuItemClicked(0);
              }}
              key="0"
              icon={<UserOutlined />}
            >
              Users
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onMenuItemClicked(1);
              }}
              key="1"
              icon={<MoneyCollectOutlined />}
            >
              Utility Expences
            </Menu.Item>
            {/* <Menu.Item
              onClick={() => {
                onMenuItemClicked(2);
              }}
              key="2"
              icon={<LaptopOutlined />}
            >
              Products
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onMenuItemClicked(3);
              }}
              key="3"
              icon={<ShopFilled />}
            >
              Sales
            </Menu.Item> */}
            <Menu.Item
              onClick={() => {
                onMenuItemClicked(4);
              }}
              key="4"
              icon={<MoneyCollectFilled />}
            >
              Salary Management
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onMenuItemClicked(5);
              }}
              key="5"
              icon={<MoneyCollectFilled />}
            >
              Employee Management
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onMenuItemClicked(6);
              }}
              key="6"
              icon={<MoneyCollectFilled />}
            >
              Attendance Management
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onMenuItemClicked(7);
              }}
              key="7"
              icon={<MoneyCollectFilled />}
            >
              Invetory & Sales
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onMenuItemClicked(8);
              }}
              key="8"
              icon={<MoneyCollectFilled />}
            >
              Appointments
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {activeIndex === 0 && <UserManagement />}
            {activeIndex === 1 && <UtilityExpencesManagement />}
            {/* {activeIndex === 2 && <ProductManagement />}
            {activeIndex === 3 && <SalesManagement />} */}
            {activeIndex === 4 && <SalaryManagement />}
            {activeIndex === 5 && <EmployeeManagement />}
            {activeIndex === 6 && <EmployeeAttendanceManagement />}
            {activeIndex === 7 && <InventoryAndSales />}
            {activeIndex === 8 && <Appointment />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
