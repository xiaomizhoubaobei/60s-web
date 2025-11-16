import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './HomePage.css'

interface Category {
  id: string
  name: string
  desc: string
  icon: string
  color: string
}

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate()

  const [categories] = useState<Category[]>([
    { 
      id: '60s', 
      name: '每日60秒', 
      desc: '每天60秒读懂世界',
      icon: '📰',
      color: '#FF6B6B'
    },
    { 
      id: 'weibo', 
      name: '微博热搜', 
      desc: '实时微博热门话题',
      icon: '🔥',
      color: '#FF9500'
    },
    { 
      id: 'zhihu', 
      name: '知乎热榜', 
      desc: '知乎热门问题',
      icon: '💡',
      color: '#007AFF'
    },
    { 
      id: 'baidu', 
      name: '百度热搜', 
      desc: '百度实时热点',
      icon: '🔍',
      color: '#4ECDC4'
    },
    { 
      id: 'douyin', 
      name: '抖音热点', 
      desc: '抖音热门视频',
      icon: '🎵',
      color: '#FE2C55'
    }
  ])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/${categoryId}`)
  }

  return (
    <div className="homepage">
      {/* 主题切换按钮 */}
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="切换主题"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <header className="homepage-header">
        <h1>🌍 60s API</h1>
        <p>高质量、开源、可靠的新闻聚合API集合</p>
      </header>

      <main className="homepage-main">
        <div className="homepage-intro">
          <p>探索来自不同平台的热门资讯和实时数据，包括每日60秒读懂世界、微博热搜、知乎热榜等。</p>
        </div>
        
        <nav className="categories-list">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-item"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <h3>{category.name}</h3>
              <p>{category.desc}</p>
            </div>
          ))}
        </nav>
      </main>

      <footer className="homepage-footer">
        <div className="homepage-footer-content">
          <p>
            数据来源：<a href="https://github.com/vikiboss/60s" target="_blank" rel="noopener noreferrer">
              60s API
            </a>
          </p>
          <p>
            <a href="https://github.com/xiaomizhoubaobei/60s-web" target="_blank" rel="noopener noreferrer">项目源码</a>
          </p>
          <p><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">渝ICP备2022010031号-8</a></p>
          <p><a href="https://icp.gov.moe/?keyword=20250975" target="_blank" rel="noopener noreferrer">萌ICP备20250975号</a></p>
        </div>
      </footer>
    </div>
  )
}
