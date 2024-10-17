// src/components/ProductManagement.tsx
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
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Product, ProductSchema, ProductType } from "../models/ProductModel";
import moment from "moment";

const { Search } = Input;

const ProductManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProducts();
      setProducts(response);
      setFilteredProducts(response);
    } catch (error) {
      message.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const product: ProductType = {
        name: values.name,
        category: values.category,
        quantity: parseInt(values.quantity),
        pricePerUnit: parseFloat(values.pricePerUnit),
        lastRestockDate: values.lastRestockDate.toDate(),
      };

      ProductSchema.parse(product);

      if (editingRecord) {
        await updateProduct(editingRecord._id, product);
        message.success("Product updated successfully!");
      } else {
        await createProduct(product);
        message.success("Product created successfully!");
      }

      form.resetFields();
      fetchProducts();
      setEditingRecord(null);
      setModalOpened(false);
    } catch (error: any) {
      if (error instanceof Error) {
        message.error(`Failed to save product: ${error.message}`);
      } else {
        message.error("Failed to save product due to an unknown error.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Product) => {
    form.setFieldsValue({
      ...record,
      lastRestockDate: moment(record.lastRestockDate),
    });
    setEditingRecord(record);
    setModalOpened(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      message.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Name",
      "Category",
      "Quantity",
      "Price Per Unit",
      "Last Restock Date",
    ];
    const tableRows = filteredProducts.map((product) => [
      product.name,
      product.category,
      product.quantity,
      product.pricePerUnit,
      new Date(product.lastRestockDate).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("Product Report", 14, 15);
    doc.save("product_report.pdf");
  };

  const handleSearch = (value: string) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Price Per Unit", dataIndex: "pricePerUnit", key: "pricePerUnit" },
    {
      title: "Last Restock Date",
      dataIndex: "lastRestockDate",
      key: "lastRestockDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Product) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
            style={{ marginRight: 8, color: '#4CAF50' }} // Green edit button
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button 
              className="danger-button" // Add a class for custom danger styling
              type="link"
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
        opacity: 0.9
      }} // Background image and opacity adjustment
    >
      <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <h1>Product Management</h1>
        <Search
          placeholder="Search by name"
          onSearch={handleSearch}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setModalOpened(true)}
          style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Green add button
        >
          Add Product
        </Button>
        <Button
          style={{ float: 'right' }}
          icon={<FileTextOutlined />}
          onClick={generateReport}
        >
          Generate Report
        </Button>
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={filteredProducts} rowKey="_id" />
        </Spin>
      </Card>

      {/* Modal */}
      <Modal
        title={editingRecord ? "Edit Product" : "Add Product"}
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
          initialValues={{ name: "", category: "", quantity: 0, pricePerUnit: 0, lastRestockDate: moment() }}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Please enter the product name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please enter the category" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="pricePerUnit"
            label="Price Per Unit"
            rules={[{ required: true, message: "Please enter the price per unit" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="lastRestockDate"
            label="Last Restock Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Green submit button
            >
              {editingRecord ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
