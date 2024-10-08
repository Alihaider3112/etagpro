
import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';
import { Table, Button, Modal, Form, Select, Input, message, Image, Upload, Tag } from 'antd';
import { useState, useEffect } from 'react';
import useFetch from '@/hooks/common/useFetch';
import axios from 'axios';
import MoreActions from '@/components/common/MoreActions';
import LucideIcon from '@/components/common/LucideIcon';
import { useRouter } from 'next/router';
import withAuth from '@/hooks/common/withauth';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useDirectories } from '@/hooks/common/useDirectories';
import { IDA_TOKEN } from '@/constants/constant';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must be smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

function Products() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [currentModel, setCurrentModel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredBrandsData, setFilteredBrandsData] = useState([]);
  const [filteredCompaniesData, setFilteredCompaniesData] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { data: brandsData, loading: brandsLoading } = useFetch('/api/brand');
  const { data: companiesData, loading: companiesLoading } = useFetch('/api/companies');

  const {
    onFinishFailed,
    handleTableChange,
    fetchData,
    handleFilterChange,
    data,
    loading,
    totalCount,
    pagination,
    filters,
    error,
  } = useDirectories('/api/product');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, filters)
  }, [])





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
    {
      title: 'Image',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (text, record) => text ? (
        <div className="relative">
          <Image
            src={text}
            width={20}
            height={20}
          />
        </div>
      ) : 'No Image',
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
          ]}
          iconStyle=" text-gray-500"
          toggleClassName="w-auto p-0 h-auto"
        />
      ),
    },
  ];

  const handleReName = (record) => {
    setIsUpdate(true);
    setCurrentModel(record);
    setIsModalOpen(record);
    form.setFieldsValue({
      brand_name: record.brand_name,
      company_name: record.company_name,
      serial_number: record.serial_number,

    });
    setImage(record.image_url)
    setIsModalOpen(true);
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      loading: true;
      return;
    }
    if (info.file.status === 'done') {
      setImage(info.file.originFileObj);
      getBase64(info.file.originFileObj, (image) => {
        loading: false;
      });
    }
  };


  const showModal = () => {
    setIsUpdate(false);
    setCurrentModel(null);
    form.resetFields();
    setImage(null);
    setIsModalOpen(true);

  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsUpdate(false)
    form.resetFields();
    setImage(null);
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`/api/images`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { image_url, _id } = response.data.result;
      setImageUrl(image_url)
      setImageId(_id)

      onSuccess(image_url, _id);
    } catch (error) {
      onError(error);
    }
  };



  const onFinish = async (values) => {
    setSubmitLoading(true);
    const token = localStorage.getItem(IDA_TOKEN);

    if (isUpdate && currentModel) {
      const { brand_name, serial_number, company_name } = values;
      const brand = filteredBrandsData.find(b => b.name === brand_name);
      const company = filteredCompaniesData.find(c => c.name === company_name);
      const updatedModel = {
        brand_name,
        brand_id: brand?._id,
        serial_number,
        company_name,
        company_id: company?._id,
        image_url: imageUrl,
        image_id: imageId
      };

      try {
        const response = await axios.put(`/api/product/${currentModel._id}`, updatedModel, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedData = data.map(item => (item._id === currentModel._id ? response.data.product : item));
        data: updatedData;

        fetchData(pagination.current, pagination.pageSize, filters);
        handleCancel()
        message.success('Product updated successfully');
        setIsModalOpen(false);
        form.resetFields();
      } catch (error) {
        message.error('Failed to update product');
      } finally {
        setSubmitLoading(false);
      }
    } else {
      const { brand_name, serial_number, company_name } = values;
      const brand = filteredBrandsData.find(b => b.name === brand_name);
      const company = filteredCompaniesData.find(c => c.name === company_name);
      const newProduct = {
        brand_name,
        brand_id: brand?._id,
        serial_number,
        company_name,
        company_id: company?._id,
        image_url: imageUrl,
        image_id: imageId
      };

      try {
        const response = await axios.post('/api/product', newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
        data: ([...data, response.data.product]);
        fetchData(pagination.current, pagination.pageSize, filters);
        TotalCount: totalCount + 1;
        handleCancel()
        message.success('Product added successfully');
        setIsModalOpen(false);
        form.resetFields();

      } catch (error) {
        console.error('Failed to add product:', error);
        message.error('Failed to add product');
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );


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
      fetchData(1, 10, { ...filters, company_name: search });
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
      fetchData(1, 10, { ...filters, brand_name: search });
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  }
  const fetchFilterBrand = async (search) => {
    if (!search || !selectedCompanyId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/brand?search=${search}&company_id=${selectedCompanyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredBrandsData(response.data.result || []);
      fetchData(1, 10, { ...filters, brand_name: search });
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };
  const handleCompanyChange = (value) => {
    setSelectedCompanyId(value);
    if (value) {
      const filteredModels = brandsData.filter(model => model.company_id === value);
      setFilteredBrandsData(filteredModels);
    } else {
      setFilteredBrandsData(brandsData);
    }
    form.setFieldsValue({ brand_name: null });
  };


  if (brandsLoading || companiesLoading) return <p>Loading...</p>;

  return (
    <Protected>
      <>
        <PageHeader
          TopBarContent={{
            pageTitle: 'Products',
          }}
          className="text-center sm:text-left lg:text-center"
        />
        <div className="w-11/12 mx-auto justify-center mt-7 lg:w-11/12 md:w-11/12 sm:w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <Select
                className="w-full lg:w-64 md:w-full sm:w-full"
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
                className="w-full lg:w-64 md:w-full sm:w-full"
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
                className="h-8 text-center rounded-md w-full lg:w-64 md:w-full sm:w-full"
                placeholder="Serial number"
                onChange={(e) => handleFilterChange({ serial_number: e.target.value })}
              />
            </div>

            <div className="flex justify-end items-center mb-6">
              <Button className="h-10 w-full lg:w-40 sm:w-full" onClick={showModal} type="primary">
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

          <Modal
            className="w-1/3 h-24  max-w-lg sm:max-w-xs md:max-w-md lg:max-w-2xl text-center"
            title="Add Product"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={form}
              name="basic"
              title={isUpdate ? 'Update Model' : 'Add a New Model'}
              className="max-w-1/3"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"

            >
              <Form.Item
                label={<span className=" w-half text-sm sm:text-base">Company</span>}
                name="company_name"
                rules={[{ required: true, message: 'Select the company name!' }]}
              >
                <Select
                  showSearch
                  placeholder="Select Company name"
                  onSearch={fetchFilterCompany}
                  filterOption={false}
                  allowClear
                  options={filteredCompaniesData.map(company => ({ value: company._id, label: company.name }))}
                  onChange={handleCompanyChange}
                />
              </Form.Item>

              <Form.Item
                label={<span className="block w-full text-sm sm:text-base">Model</span>}
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
                  className="w-full"
                />
              </Form.Item>


              <Form.Item
                label={<span className="block w-full text-sm sm:text-base">Sr.no</span>}
                name="serial_number"
                rules={[{ required: true, message: 'Please input the serial number!' }]}
              >
                <Input className="h-8 w-full" />
              </Form.Item>

              <Form.Item
                className="flex justify-center"
                rules={[
                  { validator: () => (image ? Promise.resolve() : Promise.reject('Please upload an image!')) },
                ]}
              >
                <Upload
                  name="image"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={customRequest}
                  onChange={handleChange}
                >
                  {image ? (
                    <img
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt="avatar"
                      className="w-full h-auto"
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>

              <Form.Item className="flex justify-center mt-4">
                <Button
                  className="h-10 w-full "
                  type="primary"
                  htmlType="submit"
                  style={{ border: 'none' }}
                  loading={submitLoading}
                >
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
