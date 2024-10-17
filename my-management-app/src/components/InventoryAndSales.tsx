import React from "react";
import { Tabs } from "antd";
import ProductManagement from "./ProductManagement";
import SalesManagement from "./SalesManagement";
const { TabPane } = Tabs;

const InventoryAndSales: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1" tabPosition="top">
      <TabPane tab="Inventory" key="1">
        <ProductManagement />
      </TabPane>
      <TabPane tab="Sales" key="2">
        <SalesManagement />
      </TabPane>
    </Tabs>
  );
};

export default InventoryAndSales;
