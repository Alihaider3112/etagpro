import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from "antd";
import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';


export default function Models() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: 'Dell',
      model: '2016',
      id: '1',
    },
    {
      key: '2',
      name: 'HP',
      model: '2018',
      id: '2',
    },
    {
      key: '3',
      name: 'Lenovo',
      model: '2019',
      id: '3',
    },
  ]);

  const [form] = Form.useForm();

  const showModal = () => {
    const nextId = dataSource.length + 1;
    form.setFieldsValue({ id: `${nextId}` });
    setIsModalOpen(true);
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = (values) => {
    const newData = {
      key: `${dataSource.length + 1}`,
      name: values.company,
      model: values.model,
      id: `${dataSource.length + 1}`,
    };
    setDataSource([...dataSource, newData]);
    setIsModalOpen(false);
    form.resetFields();
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
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
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
        <Table dataSource={dataSource} columns={columns} />
      </div>
      <Modal className='w-1/3 h-24 text-center' title="Add a New Model" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
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
            name="model"
            rules={[{ required: true, message: 'Please input the model name!' }]}
          >
            <Input className='h-8' />
          </Form.Item>

          <Form.Item
            label={<span className="pt-1 block w-full">Company</span>}
            name="company"
            rules={[{ required: true, message: 'Please select the company!' }]}
          >
            <Select
              showSearch
              placeholder="Select Company name"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { value: 'Mac', label: 'Mac' },
                { value: 'Lenovo', label: 'Lenovo' },
                { value: 'Hp', label: 'Hp' },
                { value: 'Dell', label: 'Dell' },
              ]}
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
