import { getProxiedImageUrl } from '@/lib/api';

interface Daily60sData {
  date: string;
  news: string[];
  cover?: string;
  tip?: string;
  image?: string;
  link?: string;
  created?: string;
  created_at?: number;
  updated?: string;
  updated_at?: number;
  day_of_week: string;
  lunar_date: string;
  api_updated?: string;
  api_updated_at?: number;
}

interface Daily60sListProps {
  data: Daily60sData;
}

export default function Daily60sList({ data }: Daily60sListProps) {
  const formatDateTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  };

  const processImageURL = (url: string): string => {
    return getProxiedImageUrl(url);
  };

  // 处理图片加载错误
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.dataset.proxyRetried) {
      target.alt = "图片加载失败";
      return;
    }
    target.alt = "图片加载失败";
  };

  return (
    <div className="daily60s-container">
      <div className="daily60s-header">
        <div className="daily60s-date-info">
          <h2 className="date-title">{data.day_of_week} {data.date}</h2>
          <p className="lunar-date">{data.lunar_date}</p>
          <p className="api-update-time">数据更新: {data.api_updated || formatDateTime(data.api_updated_at)}</p>
        </div>
        {data.cover || data.image ? (
          <div className="daily60s-image">
            <img 
              src={processImageURL(data.cover || data.image || '')} 
              alt="每日60秒新闻图片" 
              loading="lazy" 
              onError={handleImageError} 
            />
          </div>
        ) : null}
      </div>

      {data.tip ? (
        <div className="daily60s-tip">
          <p>💡 {data.tip}</p>
        </div>
      ) : null}

      <div className="daily60s-news-list">
        <h3>新闻列表</h3>
        <ol>
          {data.news.map((newsItem, index) => (
            <li key={index} className="news-item">
              <span className="news-number">{index + 1}.</span>
              <span className="news-text">{newsItem}</span>
            </li>
          ))}
        </ol>
      </div>

      {data.link ? (
        <div className="daily60s-link">
          <a 
            href={data.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="original-article-link"
          >
            阅读原文 ↗
          </a>
        </div>
      ) : null}
    </div>
  );
}