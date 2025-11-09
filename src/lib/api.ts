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