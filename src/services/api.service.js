import axios from 'axios'
import Router from 'next/router'
import { IDA_TOKEN } from '@/constants/constant'
import {
  message,
} from 'antd'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/products' // will move to read via process env
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function APIError({ error }) {
  return (
    <div className="text-left inline-flex flex-wrap max-w-sm text-sm">
      {error?.response?.data?.message}
    </div>
  )
}

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        localStorage.clear()
        Router.push({
          pathname: '/',
          query: { q: 'Unauthorized' },
        })
      } else if (status === 404) {
        // not found
        Router.push({
          pathname: '/',
        })
      } else {
        message.error(
          {
            content: <APIError error={error} />,
            className: 'ant-error-notification',
          },
          1000,
          () => { },
        )
      }
    }
    throw error.response
  },
)

const useApiService = () => ({
  get: (url, options = {}) => api.get(url, options),
  post: (url, data, options = {}) => api.post(url, data, options),
  put: (url, data, options = {}) => api.put(url, data, options),
  delete: (url, options = {}) => api.delete(url, options),
  apiUrl: API_URL,
})

export default useApiService
