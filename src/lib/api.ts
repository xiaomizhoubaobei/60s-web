const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL
  return envUrl || 'https://60s.mizhoubaobei.top/v2'
}

export const API_BASE_URL = getApiBaseUrl()