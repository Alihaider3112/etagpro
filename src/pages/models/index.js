import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';
import useFetch from '@/hooks/common/useFetch';
import axios from 'axios';
import MoreActions from '@/components/common/MoreActions';
import LucideIcon from '@/components/common/LucideIcon';
import { useRouter } from 'next/router';
import withAuth from '@/hooks/common/withauth';

function Models() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [model, setModel] = useState(false);
  const [modelToDeleteId, setModelToDeleteId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentModel, setCurrentModel] = useState(null);
  const [form] = Form.useForm();
  const [filteredCompaniesData, setFilteredCompaniesData] = useState([]);
  const [data, setData] = useState([]);
  const { data: fetchedData, loading } = useFetch('/api/brand');
  const { data: companiesData, loading: companiesLoading } = useFetch('/api/companies');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [totalCount, setTotalCount] = useState(0);
  const [tableParams, setTableParams] = useState({ pagination: { current: 1, pageSize: 10 }, filters: {}, sorter: {} });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  const fetchModels = async (page = 1, limit = 10) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/brand?page=${page}&limit=${limit}`, {
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

  const fetchFilteredCompanies = async (search) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/api/companies?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredCompaniesData(response.data.result || []);
      setPagination({ current: 1, pageSize: 10 });
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchModels(pagination.current, pagination.pageSize);
    }
  }, [pagination]);



  useEffect(() => {
    if (companiesData && Array.isArray(companiesData)) {
      setFilteredCompaniesData(companiesData);
    }
  }, [companiesData]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setModel(false);
    setIsModalOpen(false);
    form.resetFields();
    setIsUpdate(false);
    setCurrentModel(null);
  };

  const handleReName = (record) => {
    setIsUpdate(true);
    setCurrentModel(record);
    form.setFieldsValue({
      name: record.name,
      company_name: record.company_name,
      company_id: record.company_id,
    });
    setIsModalOpen(true);
  };

  const handleRemove = async (id) => {
    setDeleteLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/brand/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedData = data.filter(item => item._id !== id);
      setData(updatedData);
      setModel(false);
      fetchModels(pagination.current, pagination.pageSize);
      message.success('Model deleted successfully');
    } catch (error) {
      console.error('Error deleting model:', error);
      message.error('Failed to delete model');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setModelToDeleteId(id);
    setModel(true);
  };

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');
      let response;
      if (isUpdate && currentModel) {
        const { name, company_name, company_id } = values;
        const updatedModel = { name, company_name, company_id };
        response = await axios.put(`/api/brand/${currentModel._id}`, updatedModel, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedData = data.map(item => (item._id === currentModel._id ? response.data.brand : item));
        setData(updatedData);
        message.success('Model renamed successfully');
      } else {
        const { name, company_name, company_id } = values;
        const newModel = { name, company_name, company_id };
        response = await axios.post('/api/brand', newModel, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData([...data, response.data.result]);
        message.success('Model added successfully');
      }
      fetchModels(pagination.current, pagination.pageSize);
      setIsModalOpen(false);
      form.resetFields();
      setIsUpdate(false);
      setCurrentModel(null);
    } catch (error) {
      console.error('Error in onFinish:', error);
      message.error('Failed to submit model');
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });

    if (pagination.current !== tableParams.pagination?.current || pagination.pageSize !== tableParams.pagination?.pageSize) {
      setPagination({ current: pagination.current, pageSize: pagination.pageSize });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Company',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'actions',
      render: (_, record) => (
        <MoreActions
          icon={{ name: 'EllipsisVertical', size: 15, wrap: 'text-black' }}
          lucide
          items={[
            {
              id: 'edit',
              icon: <LucideIcon name="Pencil" size={14} wrap="mr-1" />,
              label: 'Edit',
              style: { width: '140px' },
              onClick: () => handleReName(record),
            },
            {
              id: 'delete',
              icon: <LucideIcon name="Trash2" size={14} wrap="mr-1" />,
              label: 'Delete',
              style: { width: '140px' },
              danger: true,
              onClick: () => handleDelete(record._id),
            },
          ]}
          iconStyle=" text-gray-500"
          toggleClassName="w-auto p-0 h-auto"
        />
      ),
    },
  ];

  return (
    <Protected>
      <>
        <PageHeader
          TopBarContent={{
            pageTitle: 'Models',
          }}
        />
        <div className="w-11/12 m-auto justify-center mt-7">
          <div className="flex mb-6 justify-end items-center">
            <Button className='h-8 text-center p-auto' onClick={showModal} type='primary'>Add New Model</Button>
          </div>
          <Table
            dataSource={data}
            columns={columns}
            rowKey="_id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: totalCount,
            }}
            onChange={handleTableChange}
            loading={loading || companiesLoading}
          />
        </div>
        <Modal
          className='w-1/3 h-24 text-center'
          title={isUpdate ? 'Update Model' : 'Add a New Model'}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
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
              label={<span className="pt-1 block w-full">Model</span>}
              name="name"
              rules={[{ required: true, message: 'Please input the model name!' }]}
            >
              <Input className='h-8' />
            </Form.Item>

            <Form.Item
              label={<span className="pt-1 block w-full">Company</span>}
              name="company_name"
              rules={[{ required: true, message: 'Please select the company!' }]}
            >
              <Select
                showSearch
                placeholder="Select Company name"
                allowClear
                filterOption={false}
                onSearch={fetchFilteredCompanies}
                options={filteredCompaniesData.map(company => ({ value: company.name, label: company.name }))}
                onChange={(value) => form.setFieldsValue({ company_name: value })}
              />

            </Form.Item>

            <Form.Item
              wrapperCol={{ offset: 10, span: 4 }}
            >
              <Button className='h-10 w-20' type="primary" htmlType="submit" style={{ border: 'none' }}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Delete Model"
          open={model}
          onCancel={handleCancel}
          width={400}
          footer={[
            <Button key="cancel" onClick={handleCancel} style={{ width: '80px', height: '32px' }}>
              Cancel
            </Button>,
            <Button key="ok" type="primary" danger onClick={() => handleRemove(modelToDeleteId)} style={{ width: '80px', height: '32px' }} loading={deleteLoading}>
              OK
            </Button>,
          ]}
        >
          <p>Are you sure you want to delete this model?</p>
        </Modal>
      </>
    </Protected>
  );
}

Models.getLayout = (page) => <Protected>{page}</Protected>;
Models.pageTitle = 'Models';

export default withAuth(Models);
