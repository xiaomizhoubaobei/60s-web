import { useState, useEffect } from 'react';

export interface PageData {
  data: any;
  loading: boolean;
  error: string | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

export const usePageLogic = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 初始化主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const fetchData = async <T = any>(url: string): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(
            `HTTP error! status: ${response.status}, message: ${response.statusText}`
        );
      }

      const responseData: ApiResponse<T> = await response.json();

      if (responseData.code === 200) {
        setData(responseData.data);
        return responseData.data;
      } else {
        throw new Error(responseData.msg || '获取数据失败');
      }
    } catch (err) {
      console.error('请求错误:', err);
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadPageData = async (url: string) => {
    try {
      const data = await fetchData(url);
      console.log('数据:', data);
      return data;
    } catch (err) {
      console.error('useEffect 捕获:', err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    isDarkMode,
    toggleTheme,
    setData,
    setLoading,
    setError,
    fetchData,
    loadPageData
  };
};