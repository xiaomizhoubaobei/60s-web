import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
  const location = useLocation();

  // 常见问题列表
  const faqs = [
    {
      question: "为什么会出现404错误？",
      answer: "404错误表示您尝试访问的页面不存在。这可能是因为页面已被删除、移动或URL输入有误。"
    },
    {
      question: "我该如何找到我需要的内容？",
      answer: "您可以使用上方的导航链接访问我们的主要功能页面，或者返回首页浏览所有可用选项。"
    },
    {
      question: "如何报告页面问题？",
      answer: "如果您认为这是一个错误，请通过下方的GitHub链接提交issues，我们会尽快处理。"
    }
  ];

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-header">
            <div className="not-found-emoji">🔍</div>
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">页面未找到</h2>
            <p className="not-found-message">
              抱歉，您访问的页面不存在或已被移除。
            </p>
            <p className="not-found-path">
              您尝试访问的路径: <code>{location.pathname}</code>
            </p>
          </div>

          <div className="not-found-actions">
            <Link to="/" className="not-found-button primary">
              返回首页
            </Link>
            <button 
              className="not-found-button secondary"
              onClick={() => window.history.back()}
            >
              返回上一页
            </button>
          </div>

          <div className="not-found-suggestions">
            <h3>您可能感兴趣的页面:</h3>
            <div className="suggestions-grid">
              <Link to="/60s" className="suggestion-item">每日60秒</Link>
              <Link to="/weibo" className="suggestion-item">微博热搜</Link>
              <Link to="/zhihu" className="suggestion-item">知乎热榜</Link>
              <Link to="/baidu" className="suggestion-item">百度热搜</Link>
              <Link to="/douyin" className="suggestion-item">抖音热点</Link>
            </div>
          </div>

          <div className="not-found-faq">
            <h3>常见问题</h3>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div className="faq-item" key={index}>
                  <h4 className="faq-question">Q: {faq.question}</h4>
                  <p className="faq-answer">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="not-found-issues">
            <p>如果您认为这是一个错误，或者有其他问题需要反馈，请前往我们的 GitHub 仓库提交 issues：</p>
            <a 
              href="https://github.com/xiaomizhoubaobei/60s-web" 
              target="_blank" 
              rel="noopener noreferrer"
              className="issues-link"
            >
              https://github.com/xiaomizhoubaobei/60s-web
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;