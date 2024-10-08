import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';
import { useEffect, useState } from 'react';
import { Button, Modal, Form, message, Upload, Row, Col, Spin, Select, Input } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import withAuth from '@/hooks/common/withauth';
import axios from 'axios';
import useFetch from '@/hooks/common/useFetch';
import { useRouter } from 'next/router';

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

function UploadPage() {
  const router = useRouter();
  const [imagesData, setImagesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { data: imagesFetchData, loading: imagesLoading } = useFetch('/api/images');
  const [filteredBrandsData, setFilteredBrandsData] = useState([]);
  const [filteredCompaniesData, setFilteredCompaniesData] = useState([]);
  const { data: brandsFetchData, loading: brandsLoading } = useFetch('/api/brand');
  const { data: companiesFetchData, loading: companiesLoading } = useFetch('/api/companies');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  useEffect(() => {
    if (imagesFetchData && imagesFetchData.length > 0) {
      setImagesData(imagesFetchData.map(image => ({
        ...image,
        hasProduct: !!image.product_id,
      })));
    } else {
      console.log('Failed to fetch images');
    }
  }, [imagesFetchData]);

  useEffect(() => {
    if (brandsFetchData && Array.isArray(brandsFetchData)) {
      setFilteredBrandsData(brandsFetchData);
    }
  }, [brandsFetchData]);

  useEffect(() => {
    if (companiesFetchData && Array.isArray(companiesFetchData)) {
      setFilteredCompaniesData(companiesFetchData);
    }
  }, [companiesFetchData]);

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, () => {
        setLoading(false);
      });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsProductOpen(false);
    form.resetFields();
    setImageUrl(null);
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/images', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      onSuccess(response.data);
      setImageUrl(response.data.result.image_url);
      setImagesData([...imagesData, {
        ...response.data.result,
        hasProduct: false
      }]);
    } catch (error) {
      onError(error);
      message.error('Failed to add image');
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleSubmit = () => {
    message.success('Image Uploaded Successfully');
    setIsModalOpen(false);
    form.resetFields()
    setImageUrl(null);

  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
  };

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
  };

  const showProductModal = async (image) => {
    try {
      if (image.hasProduct) {
        message.info('This image already has an associated product.');
        return;
      }

      setSelectedImage(image);
      setIsProductOpen(true);
    } catch (error) {
      console.error('Failed to fetch product data:', error);
    }
  };

  const handleSubmitProduct = async (values) => {
    try {
      setSubmitLoading(true);
      const { brand_name, serial_number, company_name } = values;
      const brand = filteredBrandsData.find(b => b.name === brand_name);
      const company = filteredCompaniesData.find(c => c.name === company_name);
      const image_url = selectedImage.image_url;

      const newProduct = {
        brand_name,
        brand_id: brand?._id,
        serial_number,
        company_name,
        company_id: company?._id,
        image_url,
        image_id: selectedImage._id,
      };

      const token = localStorage.getItem('token');
      await axios.post('/api/product', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setImagesData(prevImagesData => prevImagesData.map(img => img._id === selectedImage._id ? { ...img, hasProduct: true } : img));

      setIsProductOpen(false);
      form.resetFields();
      message.success('Product added successfully');
    } catch (error) {
      message.error('Failed to submit product');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Protected>
      <PageHeader
        TopBarContent={{
          pageTitle: 'Upload',
        }}
      />
      <div className="w-full max-w-7xl mx-auto justify-center mt-7 px-4 sm:px-6 lg:px-8">
        <div className="flex mb-6 justify-end items-center">
          <Button
            className="h-10 px-4 py-2 text-center"
            type="primary"
            onClick={showModal}
            loading={submitLoading}
          >
            Upload Image
          </Button>
        </div>
        <div className="h-full">
          {imagesLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          ) : (
            <Row className="justify-center">
              {imagesData.length === 0 ? (
                <div className="flex justify-center items-center w-full h-full">
                  <p>No images found.</p>
                </div>
              ) : (
                imagesData.map((img, index) => (
                  <Col key={index} xs={12} sm={8} md={6} lg={4}>
                    <div
                      className="relative mb-2 cursor-pointer w-full h-40 flex items-center justify-center overflow-hidden"
                      onClick={() => showProductModal(img)}
                    >
                      {img.hasProduct && (
                        <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 z-10">
                          Product Added
                        </div>
                      )}
                      <img
                        src={img.image_url}
                        alt={`uploaded-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Col>
                ))
              )}
            </Row>
          )}
        </div>

        <Modal
          className="w-1/3 max-w-sm xs:max-w-xs  sm:max-w-sm md:max-w-md lg:max-w-lg text-center"
          title="Upload Image"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            name="basic"
            className="w-half"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              className="flex justify-center"
              rules={[
                { validator: () => (imageUrl ? Promise.resolve() : Promise.reject('Please upload an image!')) },
              ]}
            >
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={customRequest}
              >
                {imageUrl ? (
                  <img src={typeof imageUrl === 'string' ? imageUrl : URL.createObjectURL(imageUrl)} alt="avatar" className="w-full" />
                ) : (
                  uploadButton
                )}

              </Upload>
            </Form.Item>
            <Form.Item className="flex justify-center mt-4">
              <Button
                className="h-10 w-full max-w-xs"
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

        <Modal
          className="w-1/2 max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg text-center"
          title="Add Product"
          open={isProductOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            name="basic"
            title='Add Product'
            className="max-w-1/3"
            initialValues={{ remember: true }}
            onFinish={handleSubmitProduct}
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
                options={filteredCompaniesData.map(company => ({ value: company.name, label: company.name }))}
                onChange={(value) => form.setFieldsValue({ company_name: value })}
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
                onChange={(value) => form.setFieldsValue({ brand_name: value })}
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
            <Form.Item className="flex justify-center mt-4">
              <Button
                className="h-10 w-full max-w-xs"
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
    </Protected>

  );
}

UploadPage.getLayout = (page) => <Protected>{page}</Protected>;
UploadPage.pageTitle = 'Upload';

export default withAuth(UploadPage);