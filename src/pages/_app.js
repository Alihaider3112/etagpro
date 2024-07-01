import Head from 'next/head'
import { AppProvider } from '@/contexts/AppContext'
import { useEffect } from 'react'
import { IDA_TOKEN } from '@/constants/constant'
// import { useRouter } from 'next/router'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  // const router = useRouter()
  const getLayout = Component.getLayout || (page => page)
  const title = Component.pageTitle || 'Login - Inventory'

  useEffect(() => {
    // Check if the token is present in localStorage
    const token = localStorage.getItem(IDA_TOKEN) // Replace with your token key
    if (token) {
      if (window.location.pathname === '/') {
        // Token exists, redirect to the chat dashboard page
        // router.replace('/products')
      }
    }
  }, [])
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <AppProvider>{getLayout(<Component {...pageProps} />)}</AppProvider>
    </>
  )
}
