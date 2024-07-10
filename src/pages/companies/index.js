import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useFetch from '@/hooks/useFetch';

export default function Companies() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: fetchedData, error, loading } = useFetch('/api/companies');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
    }
  }, [fetchedData]);

   

  const addCompany = async (company) => {
    try {
      const response = await axios.post('/api/companies', company);
      const newDataSource = [...data, response.data.result];
      setData(newDataSource);
      setIsModalOpen(false);
     
      form.resetFields();
      message.success('Company added successfully');
    } catch (error) {
      message.error('Failed to add company');
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onFinish = (values) => {
    const newCompany = {
      name: values.name,
    };
    addCompany(newCompany);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Company',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <>
      <PageHeader
        TopBarContent={{
          pageTitle: 'Companies',
        }}
      />
      <div className="w-11/12 m-auto justify-center mt-7 w-full">
        <div className="flex mb-6 justify-end items-center">
          <Button className="h-8 text-center p-auto" onClick={showModal} type="primary">
            Create Company
          </Button>
        </div>
       
        <Table dataSource={data} columns={columns} loading={loading} rowKey="_id" />
        <Modal className='w-1/3 h-24 text-center ' title="Add Company" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
          <Form
            form={form}
            name="basic"
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              label="Company"
              name="name"
              rules={[{ required: true, message: 'Please input the company name!' }]}
            >
              <Input />
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

Companies.getLayout = (page) => <Protected>{page}</Protected>;
Companies.pageTitle = 'Companies';
