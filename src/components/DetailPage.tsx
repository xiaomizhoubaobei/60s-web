import { useState, useEffect } from 'react';

import './DetailPage.css';

import { API_BASE_URL, getSupportedLanguages, getProxiedImageUrl } from '@/lib/api';

interface NewsItem {
  title: string;
  cover?: string;
  hot?: number;
  url?: string;
  link?: string;
  created_at?: string;
}

interface ApiResponse {
  code: number;
  msg: string;
  data: NewsItem[] | never;
}

interface DetailPageProps {
  categoryId: string;
  onBack: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function DetailPage({
                                     categoryId,
                                     onBack,
                                     isDarkMode,
                                     toggleTheme,
                                   }: DetailPageProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryInfo = {
    '60s': { name: '每日60秒', icon: '📰', color: '#FF6B6B' },
    'weibo': { name: '微博热搜', icon: '🔥', color: '#FF9500' },
    'zhihu': { name: '知乎热榜', icon: '💡', color: '#007AFF' },
    'baidu': { name: '百度热搜', icon: '🔍', color: '#4ECDC4' },
    'douyin': { name: '抖音热点', icon: '🎵', color: '#FE2C55' },
    'weather': { name: '天气信息', icon: '🌤️', color: '#45B7D1' },
    'translate': { name: '在线翻译', icon: '🌐', color: '#9B59B6' },
  };

  const currentCategory = categoryInfo[categoryId as keyof typeof categoryInfo];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 优化：将API端点映射移到组件外部或使用useMemo缓存
      const endpoints: Record<string, string> = {
        '60s': `${API_BASE_URL}/60s`,
        'weibo': `${API_BASE_URL}/weibo`,
        'zhihu': `${API_BASE_URL}/zhihu`,
        'baidu': `${API_BASE_URL}/baidu`,
        'douyin': `${API_BASE_URL}/douyin`,
        'weather': `${API_BASE_URL}/weather?city=北京`,
      };

      const apiUrl = endpoints[categoryId] || `${API_BASE_URL}/60s`;
      
      // 翻译页面特殊处理
      if (categoryId === 'translate') {
        setData({ type: 'translate', message: '请在下方输入框中进行翻译操作' });
        setLoading(false);
        return;
      }

      const response = await fetch(apiUrl, {
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

      const responseData: ApiResponse = await response.json();

      if (responseData.code === 200) {
        setData(responseData.data);
      } else {
        throw new Error(responseData.msg || '获取数据失败');
      }
    } catch (err) {
      console.error('请求错误:', err);
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId !== 'translate') {
      fetchData();
    }
  }, [categoryId]);

  useEffect(() => {
    const loadLanguages = async () => {
      setLangLoading(true);

      try {
        const supportedLanguages = await getSupportedLanguages();
        setLanguages(supportedLanguages);
      } catch (error) {
        console.error('加载语言列表失败:', error);
      } finally {
        setLangLoading(false);
      }
    };

    if (categoryId === 'translate') {
      loadLanguages();
    }
  }, [categoryId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleLinkClick = (url: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // 在新窗口打开链接
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = (item: NewsItem) => {
    // 如果有链接，在新窗口打开
    const link = item.url || item.link;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const renderNewsData = (items: NewsItem[]) => (
      <div className="news-grid">
        {items.map((item, index) => {
          const itemLink = item.url || item.link;
          return (
              <article
                  key={index}
                  className="news-card"
                  onClick={() => handleCardClick(item)}
                  style={{ cursor: itemLink ? 'pointer' : 'default' }}
              >
                {item.cover && (
                    <div
                        className="news-image"
                        onClick={(e) => {
                          if (itemLink) {
                            handleLinkClick(itemLink, e);
                          }
                        }}
                    >
                      <img 
                        src={processImageURL(item.cover)} 
                        alt={item.title} 
                        loading="lazy" 
                        onError={(e) => item.cover && handleImageError(e, item.cover)} 
                      />
                      {itemLink && (
                          <div className="image-overlay">
                            <span className="overlay-text">点击查看详情</span>
                          </div>
                      )}
                    </div>
                )}

                <div className="news-content">
                  <h3 className="news-title">
                    {itemLink ? (
                        <a
                            href={itemLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleLinkClick(itemLink, e)}
                            className="news-link"
                        >
                          {item.title}
                          <span className="link-indicator">↗</span>
                        </a>
                    ) : (
                        <span className="no-link-title">{item.title}</span>
                    )}
                  </h3>

                  <div className="news-meta">
                    {item.hot && <span className="hot-badge">🔥 {item.hot}</span>}
                    {item.created_at && (
                        <span className="date">{formatDate(item.created_at)}</span>
                    )}
                    {itemLink && (
                        <span className="external-link-hint">外部链接</span>
                    )}
                  </div>
                </div>
              </article>
          );
        })}
      </div>
  );

  const renderWeatherData = (weatherData: any) => (
      <div className="weather-detail">
        <div className="weather-main">
          <h3>{weatherData.location?.city || '北京'}</h3>
          <div className="temperature">
            {weatherData.weather?.temperature}°C
          </div>
          <div className="weather-desc">
            {weatherData.weather?.condition}
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="label">💧 湿度</span>
            <span className="value">
            {weatherData.weather?.humidity}%
          </span>
          </div>
          <div className="detail-item">
            <span className="label">💨 风力</span>
            <span className="value">
            {weatherData.weather?.wind_direction}{' '}
              {weatherData.weather?.wind_power}级
          </span>
          </div>
          <div className="detail-item">
            <span className="label">🌡️ 气压</span>
            <span className="value">
            {weatherData.weather?.pressure} hPa
          </span>
          </div>
          <div className="detail-item">
            <span className="label">💨 降水量</span>
            <span className="value">
            {weatherData.weather?.precipitation} mm
          </span>
          </div>
          <div className="detail-item">
            <span className="label">🌬️ 空气质量</span>
            <span className="value">
            {weatherData.air_quality?.quality} (AQI:{' '}
              {weatherData.air_quality?.aqi})
          </span>
          </div>
          <div className="detail-item">
            <span className="label">🕐 更新时间</span>
            <span className="value">
            {weatherData.weather?.updated}
          </span>
          </div>
        </div>
      </div>
  );

  // Translation state (moved outside renderTranslateSection)
  const [sourceText, setSourceText] = useState('');
  const [translation, setTranslation] = useState<any>(null);
  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(
      null
  );
  const [targetLang, setTargetLang] = useState('en');
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>(
      [
        { code: 'en', name: '英语' },
        { code: 'ja', name: '日语' },
        { code: 'ko', name: '韩语' },
        { code: 'fr', name: '法语' },
        { code: 'de', name: '德语' },
        { code: 'es', name: '西班牙语' },
        { code: 'ru', name: '俄语' },
      ]
  );
  const [langLoading, setLangLoading] = useState(true);

  const translateText = async () => {
    if (!sourceText.trim()) {
      setTranslationError('请输入要翻译的文本');
      return;
    }

    // 验证目标语言参数
    const validTargetLangs = languages.map((lang) => lang.code);
    if (!validTargetLangs.includes(targetLang)) {
      setTranslationError('不支持的目标语言');
      return;
    }

    setTranslating(true);
    setTranslationError(null);
    try {
      const response = await fetch(
          `${API_BASE_URL}/translate?text=${encodeURIComponent(
              sourceText
          )}&to=${targetLang}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.code === 200) {
        setTranslation(data.data);
      } else {
        throw new Error(data.msg || '翻译失败');
      }
    } catch (err) {
      setTranslationError(
          err instanceof Error ? err.message : '未知错误'
      );
      setTranslation(null);
    } finally {
      setTranslating(false);
    }
  };
  // 处理图片URL，解决防盗链问题
  const processImageURL = (url: string): string => {
    // 使用我们新创建的代理函数
    return  getProxiedImageUrl(url);
  };
  // 图片加载错误处理
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, originalSrc: string) => {
    const target = e.target as HTMLImageElement;
    // 检查是否已经重试过代理URL，防止无限循环
    if (target.dataset.proxyRetried) {
      // 如果已经重试过，显示默认图片或错误信息
      target.alt = "图片加载失败";
      return;
    }
    // 如果是微信图片，尝试使用代理服务
    if (originalSrc && (originalSrc.includes('mmbiz.qpic.cn') || originalSrc.includes('wx_fmt=jpeg'))) {
    }
    // 如果代理服务也失败，显示默认图片或错误信息
    target.alt = "图片加载失败";
  };

  const renderTranslateSection = () => {
    return (
        <div className="translate-section">
          {langLoading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>正在加载语言列表...</p>
              </div>
          ) : (
              <>
                <div className="translation-form">
                  <div className="form-group">
                    <label htmlFor="source-text">输入文本：</label>
                    <textarea
                        id="source-text"
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        placeholder="请输入要翻译的中文文本..."
                        rows={4}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="target-lang">目标语言：</label>
                    <select
                        id="target-lang"
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                    >
                      {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                      ))}
                    </select>
                  </div>

                  <button
                      className="translate-btn"
                      onClick={translateText}
                      disabled={translating || !sourceText.trim()}
                  >
                    {translating ? '翻译中...' : '开始翻译'}
                  </button>
                </div>

                {translationError && (
                    <div className="widget-error">
                      <p>❌ {translationError}</p>
                    </div>
                )}

                {translation && (
                    <div className="translation-result">
                      <div className="result-item">
                        <h4>原文：</h4>
                        <p>{translation.original_text}</p>
                      </div>
                      <div className="result-item">
                        <h4>
                          译文 ({languages.find((l) => l.code === translation.target_lang)?.name})：
                        </h4>
                        <p>{translation.translated_text}</p>
                      </div>
                    </div>
                )}
              </>
          )}
        </div>
    );
  };

  return (
      <div className="detail-page">
        {/* 主题切换按钮 */}
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="切换主题"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        <header
            className="detail-header"
            style={{
              '--category-color': currentCategory?.color,
            } as React.CSSProperties}
        >
          <button className="back-button" onClick={onBack}>
            ← 返回首页
          </button>
          <div className="header-content">
            <div className="category-icon">
              {currentCategory?.icon}
            </div>
            <h1>{currentCategory?.name}</h1>
          </div>
        </header>

        <main className="detail-main">
          {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>正在加载数据...</p>
              </div>
          )}

          {error && (
              <div className="error">
                <h3>❌ 错误信息</h3>
                <p>{error}</p>
                <button onClick={fetchData}>重试</button>
              </div>
          )}

          {!loading && !error && data && (
              <div className="data-container">
                {categoryId === 'weather' && renderWeatherData(data)}
                {categoryId === 'translate' && renderTranslateSection()}
                {categoryId === '60s' &&
                    data.news &&
                    Array.isArray(data.news) &&
                    renderNewsData(
                        data.news.map((title: string) => ({
                          title,
                          url: data.link,
                          cover: data.image || data.cover,  // 优先使用image字段，如果没有则使用cover字段
                          created_at: data.created_at,
                        }))
                    )}
                {['weibo', 'zhihu', 'baidu', 'douyin'].includes(categoryId) &&
                    Array.isArray(data) &&
                    renderNewsData(data)}
              </div>
          )}

          {!loading && !error && !data && categoryId !== 'translate' && (
              <div className="empty-state">
                <p>暂无数据</p>
              </div>
          )}
        </main>

        <footer className="homepage-footer">

          <div className="homepage-footer-content">

            <p>

              数据来源：

              <a

                  href="https://github.com/vikiboss/60s"

                  target="_blank"

                  rel="noopener noreferrer"

              >

                60s API

              </a>

            </p>

            <p>

              <a

                  href="https://github.com/xiaomizhoubaobei/60s-web"

                  target="_blank"

                  rel="noopener noreferrer"

              >

                项目源码

              </a>

            </p>

            <p>

              <a

                  href="https://beian.miit.gov.cn/"

                  target="_blank"

                  rel="noopener noreferrer"

              >

                渝ICP备2022010031号-8

              </a>

            </p>

            <p>

              <a

                  href="https://icp.gov.moe/?keyword=20250975"

                  target="_blank"

                  rel="noopener noreferrer"

              >

                萌ICP备20250975号

              </a>

            </p>

          </div>

        </footer>
      </div>
  );
}