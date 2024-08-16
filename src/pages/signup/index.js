import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Account from '@/layouts/Account';
import Public from '@/layouts/Public';
import { showNotification } from '@/constants/utils';
import axios from 'axios';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

export default function SignUp() {
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [lock, setLock] = useState('Lock');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');

  const handleSignUp = async () => {
    setLoader(true);
    try {
      const response = await axios.post('/api/user/', { first_name, last_name, email, password });
      const resp = await axios.post('/api/login/', { email, password });

      localStorage.setItem('token', response.data.token);
      router.replace('/');
      showNotification('Signed Up Successfully', '', { type: 'success' });
    } catch (error) {
      console.log('Failed to sign up:', error);
      showNotification('Sign Up Failed', '', { type: 'error' });
    } finally {
      setLoader(false);
    }
  };

  const onSubmit = async (values) => {
    setEmail(values.email);
    setPassword(values.password);
    setFirstName(values.firstname);
    setLastName(values.lastname);
    await handleSignUp();
  };

  return (
    <Form name="form_SignUp" autoComplete="off" onFinish={onSubmit}>
      <Form.Item
        name="firstname"
        rules={[
          {
            required: true,
            message: 'Please enter your First Name.'
          }
        ]}
      >
        <Input
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          size="large"
          prefix={
            <UserOutlined
              style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.5)' }}
            />
          }
          placeholder="First Name"
        />
      </Form.Item>

      <Form.Item
        name="lastname"
        rules={[
          {
            required: true,
            message: 'Please enter your Last Name.'
          }
        ]}
      >
        <Input
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          size="large"
          prefix={
            <UserOutlined
              style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.5)' }}
            />
          }
          placeholder="Last Name"
        />
      </Form.Item>

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
            <MailOutlined
              style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.5)' }}
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
            <LockOutlined
              style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.5)' }}
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
        Sign Up
      </Button>
    </Form>
  );
}

SignUp.getLayout = (page) => (
  <Public>
    <Account heading="Add New Account">{page}</Account>
  </Public>
);
SignUp.pageTitle = 'Sign Up';
