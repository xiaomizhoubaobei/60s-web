import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './components/HomePage'
import Daily60sPage from './pages/60s'
import WeiboPage from './pages/weibo'
import ZhihuPage from './pages/zhihu'
import BaiduPage from './pages/baidu'
import DouyinPage from './pages/douyin'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/60s" element={<Daily60sPage />} />
          <Route path="/weibo" element={<WeiboPage />} />
          <Route path="/zhihu" element={<ZhihuPage />} />
          <Route path="/baidu" element={<BaiduPage />} />
          <Route path="/douyin" element={<DouyinPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App