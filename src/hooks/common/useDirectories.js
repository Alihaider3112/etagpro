import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'

export function useDirectories(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [tableParams, setTableParams] = useState({ pagination: { current: 1, pageSize: 10 }, filters: {}, sorter: {} });
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('')
  const router = useRouter();

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
      setTotalCount(response.data.totalCount || 0)
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

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const fetchFilteredData = async (search) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${url}?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredData(response.data.result || []);
      setPagination({ current: 1, pageSize: 10 });
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };
  useEffect(() => {
    fetchFilteredData(search);
  }, [search]);


  return {
    onFinishFailed,
    handleTableChange,
    fetchData,
    fetchFilteredData,
    data,
    loading,
    totalCount,
    pagination,
    tableParams,
    filters,
    error,
    filteredData,
    search,
  }
}


