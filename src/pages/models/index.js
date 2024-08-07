import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';
import useFetch from '@/hooks/common/useDirectories';
import axios from 'axios';
import MoreActions from '@/components/common/MoreActions';
import LucideIcon from '@/components/common/LucideIcon';
import { useRouter } from 'next/router';
import withAuth from '@/hooks/common/withauth';
import { useDirectories } from '@/hooks/common/useDirectories';
function Models() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [model, setModel] = useState(false);
  const [modelToDeleteId, setModelToDeleteId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentModel, setCurrentModel] = useState(null);
  const [form] = Form.useForm();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const {
    onFinishFailed,
    handleTableChange,
    fetchData,
    data,
    loading,
    totalCount,
    pagination,
    filters

  } = useDirectories(`/api/brand`)

  const {
    fetchFilteredData,
    filteredData,
    search,

  } = useDirectories(`/api/companies`)


  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, filters)
  }, [])

  useEffect(() => {
    fetchFilteredData('')
  }, [])


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);





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
      data: updatedData;
      setModel(false);
      fetchData(pagination.current, pagination.pageSize);
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
        data: updatedData;
        message.success('Model renamed successfully');
      } else {
        const { name, company_name, company_id } = values;
        const newModel = { name, company_name, company_id };
        response = await axios.post('/api/brand', newModel, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        data: ([...data, response.data.result]);
        message.success('Model added successfully');
      }
      fetchData(pagination.current, pagination.pageSize);
      setIsModalOpen(false);
      form.resetFields();
      setIsUpdate(false);
      setCurrentModel(null);
    } catch (error) {
      console.error('Error in onFinish:', error);
      message.error('Failed to submit model');
    }
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
            loading={loading}
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
                onSearch={fetchFilteredData}
                options={filteredData.map(company => ({ value: company.name, label: company.name }))}
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
