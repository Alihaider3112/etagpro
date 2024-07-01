import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function useHash() {
  const router = useRouter()
  const [hash, setHash] = useState('')

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.substr(1)
      setHash(newHash)
    }
    const initialHash = window.location.hash.substr(1)
    setHash(initialHash)

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [router.asPath])

  return hash
}

export default useHash
