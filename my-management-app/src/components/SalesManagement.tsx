// src/components/SalesManagement.tsx
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Popconfirm,
  message,
  Spin,
  Modal,
  DatePicker,
  Select,
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
} from "../api/saleService";
import { getAllProducts } from "../api/productService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Sale, SaleSchema, SaleType } from "../models/SaleModel";
import { Product } from "../models/ProductModel";
import moment from "moment";

const { Option } = Select;
const { Search } = Input;

const SalesManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Sale | null>(null);

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await getAllSales();
      setSales(response);
      setFilteredSales(response);
    } catch (error) {
      message.error("Failed to load sales.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response);
    } catch (error) {
      message.error("Failed to load products.");
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const sale: SaleType = {
        productId: values.productId,
        volume: parseInt(values.volume),
        totalSalePrice: parseFloat(values.totalSalePrice),
        paymentMethod: values.paymentMethod,
        date: values.date.toDate(),
      };

      SaleSchema.parse(sale);

      if (editingRecord) {
        await updateSale(editingRecord._id, sale);
        message.success("Sale updated successfully!");
      } else {
        await createSale(sale);
        message.success("Sale created successfully!");
      }

      form.resetFields();
      fetchSales();
      setEditingRecord(null);
      setModalOpened(false);
    } catch (error: any) {
      if (error instanceof Error) {
        message.error(`Failed to save sale: ${error.message}`);
      } else {
        message.error("Failed to save sale due to an unknown error.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Sale) => {
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
    setEditingRecord(record);
    setModalOpened(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteSale(id);
      message.success("Sale deleted successfully!");
      fetchSales();
    } catch (error) {
      message.error("Failed to delete sale.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Product",
      "Volume",
      "Total Sale Price",
      "Payment Method",
      "Date",
    ];
    const tableRows = filteredSales.map((sale) => [
      products.find((p) => p._id === sale.productId)?.name || "Unknown",
      sale.volume,
      sale.totalSalePrice,
      sale.paymentMethod,
      new Date(sale.date).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("Sales Report", 14, 15);
    doc.save("sales_report.pdf");
  };

  const handleSearch = (value: string) => {
    const filtered = sales.filter((sale) =>
      products
        .find((p) => p._id === sale.productId)
        ?.name.toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredSales(filtered);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "productId",
      key: "productId",
      render: (productId: string) =>
        products.find((p) => p._id === productId)?.name || "Unknown",
    },
    { title: "Volume", dataIndex: "volume", key: "volume" },
    { title: "Total Sale Price", dataIndex: "totalSalePrice", key: "totalSalePrice" },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Sale) => (
        <span>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8, backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Green edit button
            className="animate-button"
          />
          <Popconfirm
            title="Are you sure to delete this sale?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button 
              className="danger-button animate-button" // Add a class for custom danger styling
              type="primary" // Use primary or another valid type
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/station-bg.jpg')", // Background image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.9,
      }} // Background image and opacity adjustment
    >
      <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <h1>Sales Management</h1>
        <Search
          placeholder="Search by product"
          onSearch={handleSearch}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setModalOpened(true)}
          style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Green add button
          className="animate-button" // Add animation class for smooth hover effects
        >
          Add Sale
        </Button>
        <Button
          style={{ float: 'right' }}
          icon={<FileTextOutlined />}
          onClick={generateReport}
        >
          Generate Report
        </Button>
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={filteredSales} rowKey="_id" />
        </Spin>
      </Card>

      {/* Modal */}
      <Modal
        title={editingRecord ? "Edit Sale" : "Add Sale"}
        open={modalOpened}
        onCancel={() => {
          form.resetFields();
          setModalOpened(false);
          setEditingRecord(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ productId: "", volume: 0, totalSalePrice: 0, paymentMethod: "", date: moment() }}
        >
          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true, message: "Please select a product" }]}
          >
            <Select>
              {products.map((product) => (
                <Option key={product._id} value={product._id}>
                  {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="volume"
            label="Volume"
            rules={[{ required: true, message: "Please enter the volume" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="totalSalePrice"
            label="Total Sale Price"
            rules={[{ required: true, message: "Please enter the total sale price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="paymentMethod"
            label="Payment Method"
            rules={[{ required: true, message: "Please select a payment method" }]}
          >
            <Select>
              <Select.Option value="Cash">Cash</Select.Option>
              <Select.Option value="Credit Card">Credit Card</Select.Option>
              <Select.Option value="Mobile Payment">Mobile Payment</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesManagement;
