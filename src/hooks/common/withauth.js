import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IDA_TOKEN } from '@/constants/constant';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(IDA_TOKEN);
        if (!token) {
          router.replace('/');
        } else {
          setIsAuthenticated(true);
        }
      }
    }, [router]);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
