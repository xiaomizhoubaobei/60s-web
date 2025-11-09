import { useState, useEffect } from 'react'
import './DetailPage.css'
import { API_BASE_URL } from '@/lib/api'

interface NewsItem {
  title: string
  cover?: string
  hot?: number
  url?: string
  link?: string
  created_at?: string
}

interface ApiResponse {
  code: number
  msg: string
  data: NewsItem[] | never
}

interface DetailPageProps {
  categoryId: string
  onBack: () => void
  isDarkMode: boolean
  toggleTheme: () => void
}

export default function DetailPage({ categoryId, onBack, isDarkMode, toggleTheme }: DetailPageProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categoryInfo = {
    '60s': { name: '每日60秒', icon: '📰', color: '#FF6B6B' },
    'weibo': { name: '微博热搜', icon: '🔥', color: '#FF9500' },
    'zhihu': { name: '知乎热榜', icon: '💡', color: '#007AFF' },
    'baidu': { name: '百度热搜', icon: '🔍', color: '#4ECDC4' },
    'douyin': { name: '抖音热点', icon: '🎵', color: '#FE2C55' },
    'weather': { name: '天气信息', icon: '🌤️', color: '#45B7D1' },
    'translate': { name: '在线翻译', icon: '🌐', color: '#9B59B6' }
  }

  const currentCategory = categoryInfo[categoryId as keyof typeof categoryInfo]

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let apiUrl = ''
      
      switch(categoryId) {
        case '60s':
          apiUrl = `${API_BASE_URL}/60s`
          break
        case 'weibo':
          apiUrl = `${API_BASE_URL}/weibo`
          break
        case 'zhihu':
          apiUrl = `${API_BASE_URL}/zhihu`
          break
        case 'baidu':
          apiUrl = `${API_BASE_URL}/baidu`
          break
        case 'douyin':
          apiUrl = `${API_BASE_URL}/douyin`
          break
        case 'weather':
          apiUrl = `${API_BASE_URL}/weather?city=北京`
          break
        case 'translate':
          // 翻译API需要参数，这里先不调用
          setData({ type: 'translate', message: '请在下方输入框中进行翻译操作' })
          setLoading(false)
          return
        default:
          apiUrl = `${API_BASE_URL}/60s`
      }

      console.log('正在请求:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      })
      
      console.log('响应状态:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`)
      }
      
      const responseData: ApiResponse = await response.json()
      console.log('响应数据:', responseData)
      
      if (responseData.code === 200) {
        setData(responseData.data)
      } else {
        throw new Error(responseData.msg || '获取数据失败')
      }
    } catch (err) {
      console.error('请求错误:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(errorMessage)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (categoryId !== 'translate') {
      fetchData()
    }
  }, [categoryId])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleLinkClick = (url: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    // 在新窗口打开链接
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleCardClick = (item: NewsItem) => {
    // 如果有链接，在新窗口打开
    const link = item.url || item.link
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  const renderNewsData = (items: NewsItem[]) => (
    <div className="news-grid">
      {items.map((item, index) => {
        const itemLink = item.url || item.link
        return (
          <article 
            key={index} 
            className="news-card"
            onClick={() => handleCardClick(item)}
            style={{ cursor: itemLink ? 'pointer' : 'default' }}
          >
            {item.cover && (
              <div className="news-image" onClick={(e) => {
                if (itemLink) {
                  handleLinkClick(itemLink, e)
                }
              }}>
                <img src={item.cover} alt={item.title} loading="lazy" />
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
                {item.hot && (
                  <span className="hot-badge">🔥 {item.hot}</span>
                )}
                {item.created_at && (
                  <span className="date">{formatDate(item.created_at)}</span>
                )}
                {itemLink && (
                  <span className="external-link-hint">外部链接</span>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )

  const renderWeatherData = (weatherData: any) => (
    <div className="weather-detail">
      <div className="weather-main">
        <h3>{weatherData.location?.city || '北京'}</h3>
        <div className="temperature">{weatherData.weather?.temperature}°C</div>
        <div className="weather-desc">{weatherData.weather?.condition}</div>
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span className="label">💧 湿度</span>
          <span className="value">{weatherData.weather?.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="label">💨 风力</span>
          <span className="value">{weatherData.weather?.wind_direction} {weatherData.weather?.wind_power}级</span>
        </div>
        <div className="detail-item">
          <span className="label">🌡️ 气压</span>
          <span className="value">{weatherData.weather?.pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span className="label">💨 降水量</span>
          <span className="value">{weatherData.weather?.precipitation} mm</span>
        </div>
        <div className="detail-item">
          <span className="label">🌬️ 空气质量</span>
          <span className="value">{weatherData.air_quality?.quality} (AQI: {weatherData.air_quality?.aqi})</span>
        </div>
        <div className="detail-item">
          <span className="label">🕐 更新时间</span>
          <span className="value">{weatherData.weather?.updated}</span>
        </div>
      </div>
    </div>
  )

  // Translation state (moved outside renderTranslateSection)
  const [sourceText, setSourceText] = useState('')
  const [translation, setTranslation] = useState<any>(null)
  const [translating, setTranslating] = useState(false)
  const [translationError, setTranslationError] = useState<string | null>(null)
  const [targetLang, setTargetLang] = useState('en')

  const languages = [
    { code: 'en', name: '英语' },
    { code: 'ja', name: '日语' },
    { code: 'ko', name: '韩语' },
    { code: 'fr', name: '法语' },
    { code: 'de', name: '德语' },
    { code: 'es', name: '西班牙语' },
    { code: 'ru', name: '俄语' }
  ]

  const translateText = async () => {
    if (!sourceText.trim()) {
      setTranslationError('请输入要翻译的文本')
      return
    }

    setTranslating(true)
    setTranslationError(null)
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/translate?text=${encodeURIComponent(sourceText)}&to=${targetLang}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.code === 200) {
        setTranslation(data.data)
      } else {
        throw new Error(data.msg || '翻译失败')
      }
    } catch (err) {
      setTranslationError(err instanceof Error ? err.message : '未知错误')
      setTranslation(null)
    } finally {
      setTranslating(false)
    }
  }

  const renderTranslateSection = () => {
    return (
      <div className="translate-section">
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
              {languages.map(lang => (
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
              <h4>译文 ({languages.find(l => l.code === translation.target_lang)?.name})：</h4>
              <p>{translation.translated_text}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

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

      <header className="detail-header" style={{ '--category-color': currentCategory?.color } as React.CSSProperties}>
        <button className="back-button" onClick={onBack}>
          ← 返回首页
        </button>
        <div className="header-content">
          <div className="category-icon">{currentCategory?.icon}</div>
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
            {categoryId === '60s' && data.news && Array.isArray(data.news) && renderNewsData(data.news.map((title: string) => ({
              title,
              url: data.link,
              cover: data.cover,
              created_at: data.created_at
            })))}
            {['weibo', 'zhihu', 'baidu', 'douyin'].includes(categoryId) && Array.isArray(data) && renderNewsData(data)}
          </div>
        )}

        {!loading && !error && !data && categoryId !== 'translate' && (
          <div className="empty-state">
            <p>暂无数据</p>
          </div>
        )}
      </main>
    </div>
  )
}