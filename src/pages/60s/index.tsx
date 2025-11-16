import React, { useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { usePageLogic } from '@/lib/usePageLogic';
import Daily60sList from '@/components/Daily60sList';
import Footer from '@/components/Footer';
import './index.css';

export default function Daily60sPage() {
  const { data, loading, error, isDarkMode, toggleTheme, loadPageData } = usePageLogic();

  useEffect(() => {
    void loadPageData(`${API_BASE_URL}/60s`);
  }, []);

  return (
      <div className="dailtiany60s-page">
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
              '--category-color': '#FF6B6B',
            } as React.CSSProperties}
        >
          <a className="back-button" href="/">
            ← 返回首页
          </a>
          <div className="header-content">
            <div className="category-icon">
              📰
            </div>
            <h1>每日60秒</h1>
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
                <button onClick={() => void loadPageData(`${API_BASE_URL}/60s`)}>重试</button>
              </div>
          )}

          {!loading && !error && data && (
              <div className="data-container">
                <Daily60sList data={data} />
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