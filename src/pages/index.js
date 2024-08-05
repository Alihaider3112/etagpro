import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Account from '@/layouts/Account';
import Public from '@/layouts/Public';
import { showNotification } from '@/constants/utils';
import LucideIcon from '@/components/common/LucideIcon';
import axios from 'axios';

export default function Login() {
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [lock, setLock] = useState('Lock');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setLoader(true);
    try {
      const response = await axios.post('/api/login/', { email, password });
      localStorage.setItem('token', response.data.token);
      router.replace('/products');
      showNotification('Logged in Successfully', '', { type: 'success' }); 
    } catch (error) {
      console.log('Failed to login:', error);
      showNotification('Invalid Credentials', '', { type: 'error' }); 
    } finally {
      setLoader(false);
    }
  };

  const onSubmit = async (values) => {
    setEmail(values.email);
    setPassword(values.password);
    await handleLogin();
  };

  return (
    <Form name="form_login" autoComplete="off" onFinish={onSubmit}>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please enter your email.',
            type: 'email'
          }
        ]}
      >
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="large"
          prefix={
            <LucideIcon
              name="Mail"
              size={18}
              wrap="site-form-item-icon text-gray-500"
            />
          }
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please enter your password.'
          }
        ]}
      >
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          prefix={
            <LucideIcon
              name={lock}
              size={18}
              filled
              wrap="site-form-item-icon transition transition-all text-gray-500"
            />
          }
          type="password"
          placeholder="Password"
          size="large"
          visibilityToggle={{
            onVisibleChange: (visible) => {
              setLock(visible ? 'Unlock' : 'Lock');
            }
          }}
        />
      </Form.Item>
      <Button
        type="primary"
        size="large"
        htmlType="submit"
        loading={loader}
        block
      >
        Log In
      </Button>
    </Form>
  );
}

Login.getLayout = (page) => (
  <Public>
    <Account heading="Welcome back!">{page}</Account>
  </Public>
);
Login.pageTitle = 'Login - Inventory';
