import { useEffect } from 'react'

export default function useFocusInput(inputRef, deps = []) {
  useEffect(() => {
    try {
      inputRef.current?.focus({
        cursor: 'end',
      })
    } catch (e) {
      console.log(e)
    }
  }, deps)
}
