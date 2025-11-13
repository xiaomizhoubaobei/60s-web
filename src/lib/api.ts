import { fanyi } from "./fanyi";

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  // 验证环境变量是否为有效的URL
  if (envUrl) {
    try {
      const url = new URL(envUrl);

      // 只允许 HTTPS 或 HTTP 协议以提高安全性
      if (url.protocol === "https:" || url.protocol === "http:") {
        return url.href;
      }
    } catch (error) {
      console.error("Invalid VITE_API_BASE_URL environment variable:", envUrl);
    }
  }

  const baseUrl = "https://60s.mizhoubaobei.top/v2";
  // 默认返回的 API 基础 URL
  return baseUrl.replace(/\/$/, '')
};

// 添加防抖函数优化API请求
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(func(...args)), wait);
    });
  };
};

export const API_BASE_URL = getApiBaseUrl();

// 获取支持的翻译语言列表
export const getSupportedLanguages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/fanyi/langs`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 假设API返回格式为 { code: number, msg: string, data: { code: string, name: string }[] }
    if (data.code === 200 && data.data) {
      return data.data;
    } else {
      throw new Error(data.msg || "获取语言列表失败");
    }
  } catch (error) {
    console.error("获取翻译语言列表失败:", error);

    // 如果API调用失败，返回默认语言列表
    return fanyi();
  }
};

// 图片代理函数，用于解决防盗链问题
export const getProxiedImageUrl = (url: string): string => {
  if (!url) return '';
  
  // 检查是否是微信图片链接
  if (url.includes('mmbiz.qpic.cn') || url.includes('wx_fmt=jpeg')) {
    // 使用图片代理服务来绕过防盗链
    return `https://images.weserv.nl/?url=${encodeURIComponent(url.replace('http://', '').replace('https://', ''))}&w=800&q=85`;
  }
  
  return url;
};