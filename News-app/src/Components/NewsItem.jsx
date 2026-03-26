import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const NewsItem = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  
  const placeholderImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop";

  return (
    <article className="news-card">
      <div style={{ overflow: 'hidden' }}>
        <img 
          src={imageError ? placeholderImage : article.urlToImage} 
          alt={article.title}
          className="news-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
      
      <div className="news-content">
        <span className="news-category">{article.source?.name || 'News'}</span>
        
        <h2 className="news-title">{article.title}</h2>
        
        <p className="news-desc">
          {article.description || 'No description available for this article.'}
        </p>
        
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="read-more"
        >
          Read More <ArrowRight size={16} />
        </a>
      </div>
    </article>
  );
};

// ADD THIS LINE:
export default NewsItem;