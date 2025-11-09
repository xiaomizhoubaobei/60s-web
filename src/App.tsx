import { useState, useEffect } from 'react'
import './App.css'
import HomePage from './components/HomePage'
import DetailPage from './components/DetailPage'

type PageType = 'home' | 'detail'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // 从URL解析初始状态
    const parseURL = () => {
      const pathname = window.location.pathname
      if (pathname === '/' || pathname === '') {
        setCurrentPage('home')
        setSelectedCategoryId('')
      } else {
        // 移除开头的斜杠，获取categoryId
        const categoryId = pathname.slice(1)
        setCurrentPage('detail')
        setSelectedCategoryId(categoryId)
      }
    }

    // 监听popstate事件（浏览器前进后退）
    const handlePopState = () => {
      parseURL()
    }

    // 初始化
    parseURL()
    window.addEventListener('popstate', handlePopState)

    // 清理监听器
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    // 初始化主题
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

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

  const handleNavigate = (page: PageType, categoryId?: string) => {
    setCurrentPage(page)
    setSelectedCategoryId(categoryId || '')
    
    // 更新URL路径 - 使用History API
    if (page === 'home') {
      window.history.pushState({}, '', '/')
      document.title = '60s API- 探索高质量API服务'
    } else {
      window.history.pushState({}, '', `/${categoryId}`)
      const categoryNames: Record<string, string> = {
        '60s': '每日60秒',
        'weibo': '微博热搜',
        'zhihu': '知乎热榜',
        'baidu': '百度热搜',
        'douyin': '抖音热点',
        'weather': '天气信息',
        'translate': '在线翻译'
      }
      document.title = `${categoryNames[categoryId || '']} - 60s API`
    }
  }

  const handleBackToHome = () => {
    handleNavigate('home')
  }

  return (
    <div className="app">
      {currentPage === 'home' ? (
        <HomePage 
          onNavigate={handleNavigate}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      ) : (
        <DetailPage 
          categoryId={selectedCategoryId}
          onBack={handleBackToHome}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  )
}

export default App