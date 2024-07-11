import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';
import { Table, Button, Modal, Form, Select, Input, message } from 'antd';
import { useState, useEffect } from 'react';
import useFetch from '@/hooks/useFetch';
import axios from 'axios';

export default function Products() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: fetchData, loading, error } = useFetch('/api/product');
  const { data: brandsData, loading: brandsLoading } = useFetch('/api/brand');
  const { data: companiesData, loading: companiesLoading } = useFetch('/api/companies');
  const [filteredBrandsData, setFilteredBrandsData] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [filters, setFilters] = useState({ company: '', model: '', srno: '' });

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

  useEffect(() => {
    if (fetchData) {
      setData(fetchData);
      setFilteredDataSource(fetchData);
    }
  }, [fetchData]);

  useEffect(() => {
    if (brandsData && brandsData.length > 0) {
      setFilteredBrandsData(brandsData);
    }
  }, [brandsData]);

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
      const { brand_name, brand_id, serial_number, company_name, company_id } = values;
      const brand = filteredBrandsData.find(b => b.name === brand_name);
      const company = companiesData.find(c => c.name === company_name);

      const newProduct = {
        brand_name,
        brand_id: brand?._id,
        serial_number,
        company_name,
        company_id: company?._id,
      };
      console.log(newProduct)

      const response = await axios.post('/api/product', newProduct);
      
      const savedProduct = response.data.result;
      setData([...data, savedProduct]);
      setFilteredDataSource([...data, savedProduct]);
      setIsModalOpen(false);
      form.resetFields();
      message.success('Product added successfully');
    } catch (error) {
      message.error('Failed to submit product');
    }
  };

  const filterData = (data, filters) => {
    return data.filter((item) => {
      return (
        (filters.company ? item.company_name === filters.company : true) &&
        (filters.model ? item.brand_name === filters.model : true) &&
        (filters.srno ? item.serial_number === filters.srno : true)
      );
    });
  };

  const handleFilterChange = (changedValues) => {
    const newFilters = { ...filters, ...changedValues };
    setFilters(newFilters);
    setFilteredDataSource(filterData(data, newFilters));
  };

  if (loading || brandsLoading || companiesLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <PageHeader
        TopBarContent={{
          pageTitle: 'Products',
        }}
      />
      <div className="w-11/12 m-auto justify-center mt-7">
        <div className='grid grid-cols-4 gap-3'>
          <div>
            <Select
              className='w-64'
              showSearch
              placeholder="Select Company name"
              onChange={(value) => handleFilterChange({ company: value })}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={companiesData ? companiesData.map(company => ({ value: company.name, label: company.name })) : []}
            />
          </div>
          <div>
            <Select
              className='w-64'
              showSearch
              placeholder="Select Model name"
              onChange={(value) => handleFilterChange({ model: value })}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={filteredBrandsData ? filteredBrandsData.map(brand => ({ value: brand.name, label: brand.name })) : []}
            />
          </div>
          <div>
            <Input
              className="h-8 text-center rounded-md"
              placeholder='Serial number'
              onChange={(e) => handleFilterChange({ srno: e.target.value })}
            />
          </div>
          <div className="flex mb-6 justify-end items-center">
            <Button className="h-8 text-center p-auto" onClick={showModal} type="primary">
              Create Product
            </Button>
          </div>
        </div>
        <Table dataSource={filteredDataSource}  pagination={{ defaultPageSize: 10, hideOnSinglePage: true }} columns={columns} rowKey="_id" />
        <Modal className='w-1/3 h-24 text-center' title="Add Product" open={isModalOpen} onCancel={handleCancel} footer={null}>
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
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={companiesData ? companiesData.map(company => ({ value: company.name, label: company.name })) : []}
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
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={filteredBrandsData ? filteredBrandsData.map(brand => ({ value: brand.name, label: brand.name })) : []}
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
  );
}

Products.getLayout = (page) => <Protected>{page}</Protected>;
Products.pageTitle = 'Products';
