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
export const API_BASE_URL = getApiBaseUrl();

// 防抖函数实现
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let latestArgs: Parameters<T> | null = null;
  let resolveFunctions: ((value: ReturnType<T> | PromiseLike<ReturnType<T>>) => void)[] = [];
  
  return function (...args: Parameters<T>): Promise<ReturnType<T>> {
    // 存储最新的参数
    latestArgs = args;
    
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // 返回一个新的 Promise，并保存 resolve 函数
    return new Promise<ReturnType<T>>((resolve) => {
      // 将 resolve 函数添加到数组中
      resolveFunctions.push(resolve);
      
      // 设置新的定时器
      timeoutId = setTimeout(() => {
        if (latestArgs) {
          // 使用最新的参数调用函数
          const result = func(...latestArgs);
          
          // 解析所有等待的 Promise
          Promise.resolve(result).then(res => {
            resolveFunctions.forEach(resolveFn => resolveFn(res));
            resolveFunctions = []; // 清空 resolve 函数数组
          });
        }
        timeoutId = null;
      }, delay);
    });
  };
}

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
  
  // 验证输入URL的安全性
  try {
    // 使用 URL 构造函数验证 URL 格式是否正确
    const parsedUrl = new URL(url);
    
    // 只允许 HTTP 和 HTTPS 协议
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      console.warn('Invalid protocol in URL:', url);
      return '';
    }
    
    // 检查是否是微信图片链接
    if (url.includes('mmbiz.qpic.cn') || url.includes('wx_fmt=jpeg')) {
      // 清理 URL，移除协议部分
      const cleanUrl = url.replace('https://', '');
      
      // 验证清理后的 URL 是否仍然有效
      try {
        new URL(`https://${cleanUrl}`); // 临时添加协议以验证
        
        // 使用图片代理服务来绕过防盗链
        return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=800&q=85`;
      } catch (error) {
        console.warn('Invalid cleaned URL:', cleanUrl);
        return '';
      }
    }
  } catch (error) {
    console.warn('Invalid URL provided:', url);
    return '';
  }
  
  return url;
};