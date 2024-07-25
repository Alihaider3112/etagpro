import { notification } from 'antd';

export const classNames = (...classes) => classes.filter(Boolean).join(' ');

export const showNotification = (message, description, config = {}) => {
  const { type = 'info',placement='top', ...restConfig } = config;
  
  notification[type]({
    message,
    description,
    ...restConfig,
    placement,
  });
};

