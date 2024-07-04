import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';
import { Table, Button, Modal, Form, Select, Input } from 'antd';
import { useState } from 'react';

export default function Products() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      no: '1',
      company: 'Hp',
      srno: '4325',
      model: '2017',
    },
    {
      key: '2',
      no: '2',
      company: 'Mac',
      srno: '4326',
      model: '2018',
    },
    {
      key: '3',
      no: '3',
      company: 'Lenovo',
      srno: '4326',
      model: '2019',
    },
  ]);

  //Filters to filter table data on selection 

  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);
  const [filters, setFilters] = useState({ company: '', model: '', srno: '' });
 //Table Columns
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Sr.No',
      dataIndex: 'srno',
      key: 'srno',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
  ];

  const showModal = () => {
    const nextno = dataSource.length + 1;
    form.setFieldsValue({ no: `${nextno}` });
    setIsModalOpen(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = (values) => {
    const newData = {
      key: `${dataSource.length + 1}`,
      company: values.company,
      model: values.model,
      srno: values.srno,
      no: `${dataSource.length + 1}`,
    };
    const newDataSource = [...dataSource, newData];
    setDataSource(newDataSource);
    setFilteredDataSource(filterData(newDataSource, filters));
    setIsModalOpen(false);
    form.resetFields();
  };

  const filterData = (data, filters) => {
    return data.filter((item) => {
      return (
        (filters.company ? item.company === filters.company : true) &&
        (filters.model ? item.model === filters.model : true) &&
        (filters.srno ? item.srno === filters.srno : true)
      );
    });
  };

  const handleFilterChange = (changedValues) => {
    const newFilters = { ...filters, ...changedValues };
    setFilters(newFilters);
    setFilteredDataSource(filterData(dataSource, newFilters));
  };

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
              options={[
                { value: 'Mac', label: 'Mac' },
                { value: 'Lenovo', label: 'Lenovo' },
                { value: 'Hp', label: 'Hp' },
                { value: 'Dell', label: 'Dell' },
              ]}
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
              options={[
                { value: '2018', label: '2018' },
                { value: '2019', label: '2019' },
                { value: '2017', label: '2017' },
                { value: '2016', label: '2016' },
              ]}
            />
          </div>
          <div>
            <Input
              className="h-8 text-center rounded-md "
              placeholder='serial number'
              onChange={(e) => handleFilterChange({ srno: e.target.value })}
            />
          </div>
          <div className="flex mb-6 justify-end items-center">
            <Button className="h-8 text-center p-auto" onClick={showModal} type="primary">
              Create Product
            </Button>
          </div>
        </div>
        <Table dataSource={filteredDataSource} columns={columns} />
        <Modal className='w-1/3 h-24 text-center ' title="Add Product" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
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
              name="company"
              rules={[{ required: true, message: 'Select the company name!' }]}
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
              label={<span className="pt-1 block w-full">Model</span>}
              name="model"
              rules={[{ required: true, message: 'Select the Model name!' }]}
            >
              <Select
                showSearch
                placeholder="Select Model name"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={[
                  { value: '2018', label: '2018' },
                  { value: '2019', label: '2019' },
                  { value: '2017', label: '2017' },
                  { value: '2016', label: '2016' },
                ]}
              />
            </Form.Item>
            <Form.Item
              label={<span className="pt-1 block w-full">Sr.no</span>}
              name="srno"
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
