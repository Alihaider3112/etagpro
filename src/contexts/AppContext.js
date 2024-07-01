import { createContext, useContext, useState } from 'react'

const AppContext = createContext({
  user: null,
  setUser: () => null,
  login: () => null,
  logout: () => null,
  templates: [],
  setTemplates: () => null,
})

export function AppProvider({ children }) {
  const [user, setUser] = useState(null) // Initialize with null or your default user state
  const [templates, setTemplates] = useState(null) // Initialize with null or your default user state

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    setTemplates([])
  }

  return (
    <AppContext.Provider
      /* eslint-disable-next-line react/jsx-no-constructed-context-values */
      value={{
        user,
        setUser,
        login,
        logout,
        templates,
        setTemplates,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
