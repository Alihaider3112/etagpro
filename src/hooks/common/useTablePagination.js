import { useEffect, useState } from 'react'

export default function useTablePagination(pagination, count) {
  const [tableParams, setTableParams] = useState({
    pagination,
  })

  useEffect(() => {
    if (count) {
      setTableParams({
        pagination: { ...pagination, total: count },
      })
    }
  }, [count])

  return [tableParams, setTableParams]
}
