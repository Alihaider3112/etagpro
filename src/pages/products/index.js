import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';
import { Table, Button, Modal, Form, Select, Input, message } from 'antd';
import { useState, useEffect } from 'react';
import useFetch from '@/hooks/common/useFetch';
import axios from 'axios';
import { useRouter } from 'next/router';
import withAuth from '@/hooks/common/withauth';

function Products() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredBrandsData, setFilteredBrandsData] = useState([]);
  const [filteredCompaniesData, setFilteredCompaniesData] = useState([]);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [tableParams, setTableParams] = useState({ pagination: { current: 1, pageSize: 10 }, filters: {}, sorter: {} });
  const { data: brandsData, loading: brandsLoading } = useFetch('/api/brand');
  const { data: companiesData, loading: companiesLoading } = useFetch('/api/companies');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  const fetchProducts = async (page = 1, limit = 10, filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/product?page=${page}&limit=${limit}&filter=${JSON.stringify(filters)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchData = response.data;
      setData(fetchData.result || []);
      setTotalCount(fetchData.totalCount || 0);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize, filters);
  }, [pagination, filters]);

  useEffect(() => {
    if (brandsData && Array.isArray(brandsData)) {
      setFilteredBrandsData(brandsData);
    }
  }, [brandsData]);

  useEffect(() => {
    if (companiesData && Array.isArray(companiesData)) {
      setFilteredCompaniesData(companiesData);
    }
  }, [companiesData]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });
    setPagination({ current: pagination.current, pageSize: pagination.pageSize });
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'brand_id',
      key: 'brand_id',
    },
    {
      title: 'Company',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: 'Sr.No',
      dataIndex: 'serial_number',
      key: 'serial_number',
    },
    {
      title: 'Model',
      dataIndex: 'brand_name',
      key: 'brand_name',
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = async (values) => {
    try {
      const { brand_name, serial_number, company_name } = values;
      const brand = filteredBrandsData.find(b => b.name === brand_name);
      const company = filteredCompaniesData.find(c => c.name === company_name);

      const newProduct = {
        brand_name,
        brand_id: brand?._id,
        serial_number,
        company_name,
        company_id: company?._id,
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/product', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const savedProduct = response.data.result;
      setData(prevData => [...prevData, savedProduct]);
      setIsModalOpen(false);
      form.resetFields();
      message.success('Product added successfully');
      fetchProducts(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error('Failed to submit product');
    }
  };

  const handleFilterChange = (changedFilters) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, ...changedFilters };
      setPagination({ current: 1, pageSize: pagination.pageSize });
      return newFilters;
    });
  };

  const fetchFilterCompany = async (search) => {
    if (!search) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/companies?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredCompaniesData(response.data.result || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  }

  const fetchFilteredCompanies = async (search) => {
    if (!search) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/companies?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredCompaniesData(response.data.result || []);
      fetchProducts(1, 10, { ...filters, company_name: search });
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  }

  const fetchFilteredBrands = async (search) => {
    if (!search) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/brand?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredBrandsData(response.data.result || []);
      fetchProducts(1, 10, { ...filters, brand_name: search });
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  }

  const fetchFilterBrand = async (search) => {
    if (!search) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/brand?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredBrandsData(response.data.result || []);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  }

  if (brandsLoading || companiesLoading) return <p>Loading...</p>;

  return (
    <Protected>
      <>
        <PageHeader
          TopBarContent={{
            pageTitle: 'Products',
          }}
        />
        <div className="w-11/12 m-auto justify-center mt-7">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Select
                className="w-64"
                showSearch
                placeholder="Select Company name"
                onSearch={fetchFilteredCompanies}
                onChange={(value) => handleFilterChange({ company_name: value })}
                filterOption={false}
                allowClear
                options={filteredCompaniesData.map(company => ({ value: company.name, label: company.name }))}
              />
            </div>
            <div>
              <Select
                className="w-64"
                showSearch
                placeholder="Select Model name"
                onSearch={fetchFilteredBrands}
                onChange={(value) => handleFilterChange({ brand_name: value })}
                filterOption={false}
                allowClear
                options={filteredBrandsData.map(brand => ({ value: brand.name, label: brand.name }))}
              />
            </div>
            <div>
              <Input
                className="h-8 text-center rounded-md"
                placeholder="Serial number"
                onChange={(e) => handleFilterChange({ serial_number: e.target.value })}
              />
            </div>
            <div className="flex mb-6 justify-end items-center">
              <Button className="h-8 text-center p-auto" onClick={showModal} type="primary">
                Create Product
              </Button>
            </div>
          </div>
          <Table
            dataSource={data}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: totalCount,
            }}
            onChange={handleTableChange}
            rowKey="_id"
          />

          <Modal className="w-1/3 h-24 text-center" title="Add Product" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <Form
              form={form}
              name="basic"
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item
                label={<span className="pt-1 block w-full">Company</span>}
                name="company_name"
                rules={[{ required: true, message: 'Select the company name!' }]}
              >
                <Select
                  showSearch
                  placeholder="Select Company name"
                  onSearch={fetchFilterCompany}
                  filterOption={false}
                  allowClear
                  options={filteredCompaniesData.map(company => ({ value: company.name, label: company.name }))}
                />
              </Form.Item>

              <Form.Item
                label={<span className="pt-1 block w-full">Model</span>}
                name="brand_name"
                rules={[{ required: true, message: 'Select the model name!' }]}
              >
                <Select
                  showSearch
                  placeholder="Select Model name"
                  onSearch={fetchFilterBrand}
                  filterOption={false}
                  allowClear
                  options={filteredBrandsData.map(brand => ({ value: brand.name, label: brand.name }))}
                />
              </Form.Item>

              <Form.Item
                label={<span className="pt-1 block w-full">Sr.no</span>}
                name="serial_number"
                rules={[{ required: true, message: 'Please input the serial number!' }]}
              >
                <Input className="h-8" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 10, span: 4 }}>
                <Button className="h-10 w-20" type="primary" htmlType="submit" style={{ border: 'none' }}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </>
    </Protected>
  );
}

Products.getLayout = (page) => <Protected>{page}</Protected>;
Products.pageTitle = 'Products';

export default withAuth(Products);
