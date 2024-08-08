import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
