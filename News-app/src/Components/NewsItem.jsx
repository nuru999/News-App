import { ArrowRight, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';

const NewsItem = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  const [saved, setSaved] = useState(false);

  const placeholderImage =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800";

  /* ⭐ Load saved state */
  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem('savedNews')) || [];
    const exists = savedArticles.find((a) => a.url === article.url);
    setSaved(!!exists);
  }, [article.url]);

  /* ⭐ Toggle bookmark */
  const handleSave = () => {
    let savedArticles = JSON.parse(localStorage.getItem('savedNews')) || [];

    if (saved) {
      savedArticles = savedArticles.filter((a) => a.url !== article.url);
    } else {
      savedArticles.push(article);
    }

    localStorage.setItem('savedNews', JSON.stringify(savedArticles));
    setSaved(!saved);
  };

  return (
    <article className="news-card">

      <div className="image-wrapper">
        <img
          src={imageError ? placeholderImage : article.urlToImage}
          alt={article.title}
          className="news-image"
          onError={() => setImageError(true)}
        />
      </div>

      <div className="news-content">
        <span className="news-category">
          {article.source?.name || 'News'}
        </span>

        <h2 className="news-title">{article.title}</h2>

        <p className="news-desc">
          {article.description || 'No description available.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more"
          >
            Read More <ArrowRight size={16} />
          </a>

          {/* ⭐ Bookmark */}
          <button onClick={handleSave} className="icon-btn">
            <Bookmark fill={saved ? "currentColor" : "none"} />
          </button>

        </div>
      </div>
    </article>
  );
};

export default NewsItem;