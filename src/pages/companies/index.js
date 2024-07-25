import PageHeader from '@/components/common/PageHeader';
import Protected from '@/layouts/Protected';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useFetch from '@/hooks/common/useFetch';
import withAuth from '@/hooks/common/withauth';
import { useRouter } from 'next/router';

 function Companies() {
  const router=useRouter()
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: fetchedData, error, loading } = useFetch('/api/companies');
  const [data, setData] = useState([]);
  const[pagination,setPagination]=useState({current:1,pageSize:10})
  const[totalCount,setTotalCount]=useState(0)
  const[tableParams,setTableParams]=useState({pagination:{current:1,pageSize:10},filters:{},sorter:{}})


  const fetchComapnies=async(page=1,limit=10)=>{
    try{
      const token=localStorage.getItem('token')
      const response=await axios.get(`/api/companies/?page=${page}&limit=${limit}`,{
        headers:{
          Authorization:`Bearer ${token}`,
        }
      });

      const fetchData=response.data;
      setData(fetchData.result || [])
      setTotalCount(fetchData.totalCount || 0)

    }catch(error){
      console.error("Failed to fetch Companies",error)
    }
  }

  const handleTableChange=(pagination,filters,sorter)=>
  {
     setTableParams((
      pagination,
      filters,
      sorter
     ))

     if(pagination.current !== tableParams.pagination?.pageSize  || pagination.pageSize !== tableParams.pagination?.current)
     {
       setPagination({current:pagination.current,pageSize:pagination.pageSize})
     }
  }

  useEffect(()=>{
    fetchComapnies(pagination.current,pagination.pageSize)
  },[pagination])

  useEffect(() => {
    if (fetchedData && Array.isArray(fetchedData)) {
      setData(fetchedData);
      console.log('fetchedData:', fetchedData);
    }
  }, [fetchedData]);

   

  const addCompany = async (company) => {
    try {
      const token = localStorage.getItem('token'); 
            const response = await axios.post('/api/companies', company, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const newDataSource = [...data, response.data.result];
      setData(newDataSource);
  
      setIsModalOpen(false);
      form.resetFields();
      fetchComapnies(pagination.current,pagination.pageSize)
      message.success('Company added successfully');
    } catch (error) {
      console.error('Failed to add company:', error); 
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
    <Protected>
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
       
        <Table
         dataSource={data}
         columns={columns}
         pagination={{ 
          current:pagination.current, 
          pageSize:pagination.pageSize,
          total:totalCount,
        
        }} 
        onChange={handleTableChange}
         loading={loading} 
         rowKey="_id" />
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
    </Protected>
  );
}

Companies.getLayout = (page) => <Protected>{page}</Protected>;
Companies.pageTitle = 'Companies';
export default withAuth(Companies)