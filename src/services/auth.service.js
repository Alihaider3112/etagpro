import useApiService from '@/services/api.service'

export function useAuthService() {
  const apiService = useApiService() // simple axios

  const login = async ({ email, password }) => apiService.post({
    url: '/login',
    data: {
      email,
      password,
    },
  })

  const forgotPassword = async ({ email }) => apiService.post({
    url: '/forget-password',
    data: {
      email,
    },
  })

  const signUp = async (account) => apiService.post({
    url: '/signup',
    data: account,
  })

  const resetPassword = async (resetObject) => apiService.post({
    url: '/reset-password',
    data: resetObject,
  })

  return {
    login,
    signUp,
    forgotPassword,
    resetPassword,
  }
}
