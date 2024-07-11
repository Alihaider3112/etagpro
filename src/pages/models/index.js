import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';
import useFetch from '@/hooks/useFetch';
import axios from 'axios';

export default function Models() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentModel, setCurrentModel] = useState(null);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const { data: fetchedData, loading } = useFetch('/api/brand');
  const { data: companiesData, loading: companiesLoading } = useFetch('/api/companies');
  console.log('Fetched Data:', fetchedData); 

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);  
      console.log('Fetched Data:', fetchedData); 
    }
  }, [fetchedData]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setIsUpdate(false);
    setCurrentModel(null);
  };

  const handleUpdate = (record) => {
    setIsUpdate(true);
    setCurrentModel(record);
    form.setFieldsValue({
      name: record.name,
      company_name: record.company_name,
      company_id: record.company_id,
    });
    setIsModalOpen(true);
  };

  const onFinish = async (values) => {
    try {
      let response;
      if (isUpdate && currentModel) {
        const { name, company_name, company_id } = values;
        const updatedModel = { name, company_name, company_id };
        response = await axios.put(`/api/brand/${currentModel._id}`, updatedModel);
        const updatedData = data.map(item => (item._id === currentModel._id ? response.data.brand : item));
        setData(updatedData);
        console.log('Updated Model:', response.data.brand); 
        message.success('Model updated successfully');
      } else {
        const { name, company_name, company_id } = values;
        const newModel = { name, company_name, company_id };
        response = await axios.post('/api/brand', newModel);
        setData([...data, response.data.result]); 
        message.success('Model added successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
      setIsUpdate(false);
      setCurrentModel(null);
    } catch (error) {
      console.error('Error in onFinish:', error);  
      message.error('Failed to submit model');
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
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => handleUpdate(record)}>
          Update
        </Button>
      ),
    },
  ];

  return (
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
          pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
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
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={companiesData ? companiesData.map(company => ({ value: company.name, label: company.name })) : []}
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
    </>
  );
}

Models.getLayout = (page) => <Protected>{page}</Protected>;
Models.pageTitle = 'Models';
