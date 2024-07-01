import { notification } from 'antd'

export const classNames = (...classes) => classes.filter(Boolean).join(' ')

export const showNotification = (message, description, config = {}) => {
  const defaultConfig = {
    placement: 'top', // Default placement is 'top'
    type: 'error' // Default type is 'info'
  }
  notification.open({
    message,
    description,
    ...defaultConfig,
    ...config
  })
}
