import { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useFetch = (url, options = {}) => {
  const isBrowser = typeof window !== 'undefined';

  const [data, setData] = useState(() => {
    if (isBrowser) {
      const cachedData = localStorage.getItem(url);
      return cachedData ? JSON.parse(cachedData) : null;
    }
    return null;
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(() => {
   
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url, options);
      setData(response.data.result);
    
      setHasFetched(true);
    } catch (err) {
      setError(err);
      setHasFetched(true); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchData();
    }
  }, [url, options, hasFetched]);

  return { data, error, loading };
};

export default useFetch;