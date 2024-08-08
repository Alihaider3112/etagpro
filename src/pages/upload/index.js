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
        hasProduct: image.brand_id !== null,
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
      setImageUrl(info.file.originFileObj);
      getBase64(info.file.originFileObj, (image) => {
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

  const handleSubmit = async (values) => {
    if (!imageUrl) {
      message.error('Please upload an image before submitting.');
      return;
    }

    setSubmitLoading(true);

    const formData = new FormData();
    formData.append('image', imageUrl);

    try {
      const response = await axios.post(`/api/images`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setIsModalOpen(false);
      form.resetFields();
      setImagesData([...imagesData, {
        ...response.data.result,
        hasProduct: false
      }]);
      setImageUrl(null);
      message.success('Image Uploaded Successfully');
    } catch (error) {
      message.error('Failed to add image');
    } finally {
      setSubmitLoading(false);
    }
  };

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
        image_url
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
      <div className="w-11/12 m-auto justify-center mt-7">
        <div className="flex mb-6 justify-end items-center">
          <Button
            className="h-8 text-center p-auto"
            type="primary"
            onClick={showModal}
            loading={submitLoading}
          >
            Upload Image
          </Button>
        </div>
        <div className="h-11/12">
          {imagesLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          ) : (
            <Row>
              {imagesData.length === 0 ? (
                <div className="flex justify-center items-center w-full h-full">
                  <p>No images found.</p>
                </div>
              ) : (
                imagesData.map((img, index) => (
                  <Col key={index} span={4}>
                    <div
                      className="relative mb-2 cursor-pointer"
                      style={{
                        width: '160px',
                        height: '150px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => showProductModal(img)}
                    >
                      {img.hasProduct && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '2px 5px',
                            zIndex: 1,
                          }}
                        >
                          Product Added
                        </div>
                      )}
                      <img
                        src={img.image_url}
                        alt={`uploaded-${index}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </Col>
                ))
              )}
            </Row>
          )}
        </div>
        <Modal
          className="w-1/4 h-24 text-center"
          title="Upload Image"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            name="basic"
            style={{ maxWidth: 300 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            autoComplete="off"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              wrapperCol={{ offset: 8, span: 9 }}
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
              >
                {imageUrl ? (
                  <img src={URL.createObjectURL(imageUrl)} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 4 }}>
              <Button
                className="h-10 w-20"
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

      <Modal
        className="w-1/3 h-24 text-center"
        title="Add Product"
        open={isProductOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleSubmitProduct}
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
              onSearch={fetchFilterCompany}
              filterOption={false}
              allowClear
              options={filteredCompaniesData.map(company => ({ value: company.name, label: company.name }))}
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
              onSearch={fetchFilterBrand}
              filterOption={false}
              allowClear
              options={filteredBrandsData.map(brand => ({ value: brand.name, label: brand.name }))}
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
            <Button
              className="h-10 w-20"
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
    </Protected>
  );
}

UploadPage.getLayout = (page) => <Protected>{page}</Protected>;
UploadPage.pageTitle = 'Upload';

export default withAuth(UploadPage);