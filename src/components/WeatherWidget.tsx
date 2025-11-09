import { useState, useEffect } from 'react'

import './WeatherWidget.css'

import { API_BASE_URL, getSupportedLanguages } from '@/lib/api'

interface WeatherData {
  location: {
    name: string
    province: string
    city: string
    county: string
  }
  weather: {
    condition: string
    condition_code: string
    temperature: number
    humidity: number
    pressure: number
    precipitation: number
    wind_direction: string
    wind_power: string
    weather_icon: string
    weather_colors: string[]
    updated: string
    updated_at: number
  }
  air_quality: {
    aqi: number
    level: number
    quality: string
    pm25: number
    pm10: number
    co: number
    no2: number
    o3: number
    so2: number
    rank: number
    total_cities: number
    updated: string
    updated_at: number
  }
}

interface TranslationResponse {
  code: number
  msg: string
  data: {
    original_text: string
    translated_text: string
    source_lang: string
    target_lang: string
  }
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  
  const [sourceText, setSourceText] = useState('')
  const [translation, setTranslation] = useState<TranslationResponse['data'] | null>(null)
  const [translating, setTranslating] = useState(false)
  const [translationError, setTranslationError] = useState<string | null>(null)
  const [targetLang, setTargetLang] = useState('en')
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>([
    { code: 'en', name: '英语' },
    { code: 'ja', name: '日语' },
    { code: 'ko', name: '韩语' },
    { code: 'fr', name: '法语' },
    { code: 'de', name: '德语' },
    { code: 'es', name: '西班牙语' },
    { code: 'ru', name: '俄语' }
  ])

  // 移除了未使用的 langLoading 状态
  const fetchWeather = async () => {
    const response = await fetch(`${API_BASE_URL}/weather?city=北京`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    } else {
      throw new Error(data.msg || '获取天气数据失败');
    }
  };

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
      const data: TranslationResponse = await response.json()
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 使用 Promise.all 并行执行两个异步操作
        const [weatherData, supportedLanguages] = await Promise.all([
          fetchWeather(),
          getSupportedLanguages()
        ]);
        setWeather(weatherData);
        setLanguages(supportedLanguages);
      } catch (error) {
        setWeatherError(error instanceof Error ? error.message : '未知错误');
      } finally {
        // 确保无论成功还是失败都停止加载状态
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="weather-widget">
      {/* 天气信息卡片 */}
      <section className="widget-section">
        <h2>🌤️ 天气信息</h2>
        {loading && (
          <div className="widget-loading">
            <div className="small-spinner"></div>
            <p>获取天气数据中...</p>
          </div>
        )}
        
        {weatherError && (
          <div className="widget-error">
            <p>❌ {weatherError}</p>
            <button onClick={async () => {
              setLoading(true);
              setWeatherError(null);
              try {
                const weatherData = await fetchWeather();
                setWeather(weatherData);
              } catch (error) {
                setWeatherError(error instanceof Error ? error.message : '未知错误');
              } finally {
                setLoading(false);
              }
            }}>重试</button>
          </div>
        )}
        
        {weather && !loading && (
          <div className="weather-info">
            <div className="weather-main">
              <h3>{weather.location.city}</h3>
              <div className="temperature">{weather.weather.temperature}°C</div>
              <div className="weather-desc">{weather.weather.condition}</div>
            </div>
            
            <div className="weather-details">
              <div className="detail-item">
                <span className="label">💧 湿度</span>
                <span className="value">{weather.weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="label">💨 风力</span>
                <span className="value">{weather.weather.wind_direction} {weather.weather.wind_power}级</span>
              </div>
              <div className="detail-item">
                <span className="label">🌡️ 气压</span>
                <span className="value">{weather.weather.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="label">💨 降水量</span>
                <span className="value">{weather.weather.precipitation} mm</span>
              </div>
              <div className="detail-item">
                <span className="label">🌬️ 空气质量</span>
                <span className="value">{weather.air_quality.quality} (AQI: {weather.air_quality.aqi})</span>
              </div>
              <div className="detail-item">
                <span className="label">🕐 更新时间</span>
                <span className="value">{weather.weather.updated}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 翻译工具卡片 */}
      <section className="widget-section">
        <h2>🌐 在线翻译</h2>
        
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
      </section>
    </div>
  )
}