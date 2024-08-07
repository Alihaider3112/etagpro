
import { useState, useEffect } from 'react';
import axios from 'axios';
import {useRouter} from 'next/router'

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data.result);
        setLoading(false);
      } catch (error) {

        setError(error);
        setLoading(false);}
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
