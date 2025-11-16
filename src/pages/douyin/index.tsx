import React, { useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { usePageLogic } from '@/lib/usePageLogic';
import NewsGrid from '@/components/NewsGrid';
import Footer from '@/components/Footer';
import './index.css';

export default function DouyinPage() {
  const { data, loading, error, isDarkMode, toggleTheme, loadPageData } = usePageLogic();

  useEffect(() => {
    void loadPageData(`${API_BASE_URL}/douyin`);
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
      <div className="douyin-page">
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
              '--category-color': '#FE2C55',
            } as React.CSSProperties}
        >
          <a className="back-button" href="/">
            ← 返回首页
          </a>
          <div className="header-content">
            <div className="category-icon">
              🎵
            </div>
            <h1>抖音热点</h1>
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
                <button onClick={() => void loadPageData(`${API_BASE_URL}/douyin`)}>重试</button>
              </div>
          )}

          {!loading && !error && data && (
              <div className="data-container">
                {Array.isArray(data) && 
                  <NewsGrid 
                    items={data} 
                    formatDate={formatDate} 
                  />}
              </div>
          )}

          {!loading && !error && !data && (
              <div className="empty-state">
                <p>暂无数据</p>
              </div>
          )}
        </main>

        <Footer />
      </div>
  );
}