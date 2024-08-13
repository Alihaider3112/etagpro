import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { IDA_TOKEN } from '@/constants/constant';

export function useDirectories(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [tableParams, setTableParams] = useState({ pagination: { current: 1, pageSize: 10 }, filters: {}, sorter: {} });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(IDA_TOKEN)
    if (!token) {
      router.replace('/')
    }
  })

  const fetchData = async (page, limit, filters = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}?page=${page}&limit=${limit}&filter=${JSON.stringify(filters)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.result || []);
      setTotalCount(response.data.totalCount || 0);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, filters);
  }, [pagination, filters]);


  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });
    setPagination({ current: pagination.current, pageSize: pagination.pageSize });
  };

  const handleFilterChange = (changedFilters) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, ...changedFilters };
      setPagination({ current: 1, pageSize: pagination.pageSize });
      return newFilters;
    });
  };


  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return {
    onFinishFailed,
    handleTableChange,
    fetchData,
    handleFilterChange,
    data,
    loading,
    totalCount,
    pagination,
    tableParams,
    filters,
    error,

  };
}
