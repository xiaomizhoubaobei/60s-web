import { NewsItem } from '@/components/NewsCard';
import NewsCard from '@/components/NewsCard';

interface NewsGridProps {
  items: NewsItem[];
  formatDate?: (dateString?: string) => string;
}

export default function NewsGrid({ items, formatDate }: NewsGridProps) {
  return (
    <div className="news-grid">
      {items.map((item, index) => (
        <NewsCard 
          key={index} 
          item={item} 
          formatDate={formatDate} 
        />
      ))}
    </div>
  );
}