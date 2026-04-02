// NewsItem.jsx - Enhanced with better error handling
import { ArrowRight, Bookmark, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NewsItem = ({ article, onSavedChange }) => {
  const [imageError, setImageError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const placeholderImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop";

  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem('savedNews')) || [];
    const exists = savedArticles.find((a) => a.url === article.url);
    setSaved(!!exists);
  }, [article.url]);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      let savedArticles = JSON.parse(localStorage.getItem('savedNews')) || [];
      
      if (saved) {
        savedArticles = savedArticles.filter((a) => a.url !== article.url);
      } else {
        savedArticles.unshift({ ...article, savedAt: new Date().toISOString() });
      }
      
      localStorage.setItem('savedNews', JSON.stringify(savedArticles));
      setSaved(!saved);
      if (onSavedChange) onSavedChange();
    } catch (err) {
      console.error('Error saving article:', err);
      alert('Failed to save article. Storage might be full.');
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(article.url);
      // Could add toast notification here
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.article 
      className="news-card"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      <div className="image-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={imageError ? placeholderImage : (article.urlToImage || placeholderImage)}
          alt={article.title}
          className="news-image"
          onError={() => setImageError(true)}
          style={{ 
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.5s ease'
          }}
        />
        {saved && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'var(--primary)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            Saved
          </div>
        )}
      </div>

      <div className="news-content">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <span className="news-category">{article.source?.name || 'News'}</span>
          <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            {formatDate(article.publishedAt)}
          </small>
        </div>

        <h2 className="news-title">{article.title}</h2>

        <p className="news-desc">
          {article.description || 'No description available.'}
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: 'auto'
        }}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more"
          >
            Read More <ArrowRight size={16} />
          </a>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleShare} 
              className="icon-btn"
              title="Share article"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={handleSave} 
              className="icon-btn"
              title={saved ? "Remove from saved" : "Save article"}
              style={{ 
                color: saved ? 'var(--primary)' : 'inherit',
                borderColor: saved ? 'var(--primary)' : 'var(--border)'
              }}
            >
              <Bookmark fill={saved ? "currentColor" : "none"} size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default NewsItem;