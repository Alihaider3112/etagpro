import Head from 'next/head'
import { AppProvider } from '@/contexts/AppContext'
import { useEffect } from 'react'
import { IDA_TOKEN } from '@/constants/constant'
import { useRouter } from 'next/router'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const getLayout = Component.getLayout || (page => page)
  const title = Component.pageTitle || 'Login - Inventory'

  // useEffect(() => {
  //   const token = localStorage.getItem('token')
  //   if (token) {
  //     if (window.location.pathname === '/') {
  //       router.replace('/products')
  //     } else {
  //       router.replace('/')
  //     }
  //   }
  // }, [])
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <AppProvider>{getLayout(<Component {...pageProps} />)}</AppProvider>
    </>
  )
}
