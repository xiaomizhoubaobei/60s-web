import { getProxiedImageUrl } from '@/lib/api';

export interface NewsItem {
  title: string;
  cover?: string;
  hot?: number;
  url?: string;
  link?: string;
  created_at?: string;
}

interface NewsCardProps {
  item: NewsItem;
  formatDate?: (dateString?: string) => string;
}

export default function NewsCard({ item, formatDate }: NewsCardProps) {
  const itemLink = item.url || item.link;
  
  const handleLinkClick = (url: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // 在新窗口打开链接
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 处理图片URL，解决防盗链问题
  const processImageURL = (url: string): string => {
    // 使用我们新创建的代理函数
    return getProxiedImageUrl(url);
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

  const defaultFormatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateFn = formatDate || defaultFormatDate;

  return (
    <article
      className="news-card"
      onClick={() => {
        // 如果有链接，在新窗口打开
        if (itemLink) {
          window.open(itemLink, '_blank', 'noopener,noreferrer');
        }
      }}
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
            <span className="date">{formatDateFn(item.created_at)}</span>
          )}
          {itemLink && (
            <span className="external-link-hint">外部链接</span>
          )}
        </div>
      </div>
    </article>
  );
}