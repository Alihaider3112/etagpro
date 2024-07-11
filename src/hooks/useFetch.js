import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);
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
