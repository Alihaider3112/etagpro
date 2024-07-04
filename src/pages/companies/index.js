import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input } from "antd";
import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';

export default function Companies() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: 'Dell',
      id: '1',
    },
    {
      key: '2',
      name: 'HP',
      id: '2',
    },
    {
      key: '3',
      name: 'Lenovo',
      id: '3',
    },
  ]);

  const [form] = Form.useForm();

  const showModal = () => {
    const nextId = dataSource.length + 1;
    form.setFieldsValue({ id: `${nextId}` });
    setIsModalOpen(true);
  }

  const onFinish = (values) => {
    const newData = {
      key: `${dataSource.length + 1}`,
      name: values.name,
      id: values.id,
    };
    setDataSource([...dataSource, newData]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
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
      <div className="w-11/12 m-auto justify-center mt-7">
        <div className="flex mb-6 justify-end items-center">
          <Button className='h-8 text-center p-auto' onClick={showModal} type='primary'>Add New Company</Button>
        </div>
        <Table dataSource={dataSource} columns={columns} pagination={false}/>
      </div>
      <Modal className='w-1/3 h-24 text-center' title="Add a New Company" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
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
            label={<span className="pt-1 block w-full">Company Name</span>}
            name="name"
            rules={[{ required: true, message: 'Please input the company name!' }]}
          >
            <Input  className='h-8'/>
          </Form.Item>

          <Form.Item
            name="id"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 10, span: 4 }}
          >
            <Button className='h-10 w-20' type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

Companies.getLayout = (page) => <Protected>{page}</Protected>;
Companies.pageTitle = 'Companies';
