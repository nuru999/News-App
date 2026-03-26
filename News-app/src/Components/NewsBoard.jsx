import { motion, AnimatePresence } from 'framer-motion';
import NewsItem from './NewsItem';
import { useState, useEffect } from 'react';

// Skeleton component for loading state
const SkeletonCard = () => (
  <div className="news-card">
    <div className="skeleton" style={{ height: '220px', width: '100%' }} />
    <div style={{ padding: '1.5rem' }}>
      <div className="skeleton" style={{ height: '20px', width: '30%', marginBottom: '1rem', borderRadius: '9999px' }} />
      <div className="skeleton" style={{ height: '28px', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '60px', marginBottom: '1.5rem' }} />
      <div className="skeleton" style={{ height: '40px', width: '120px', borderRadius: '0.5rem' }} />
    </div>
  </div>
);

// Error state component
const ErrorState = ({ onRetry }) => (
  <div className="error-state" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>Failed to load news</h3>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
      Check your internet connection or API key
    </p>
    <button 
      onClick={onRetry}
      style={{
        padding: '0.75rem 1.5rem',
        background: 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontWeight: 600
      }}
    >
      Try Again
    </button>
  </div>
);

// Empty state component
const EmptyState = ({ searchQuery }) => (
  <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>No articles found</h3>
    <p style={{ color: 'var(--text-secondary)' }}>
      {searchQuery 
        ? `No results for "${searchQuery}". Try a different search term.` 
        : 'No articles available for this category.'}
    </p>
  </div>
);

const NewsBoard = ({ searchQuery = '' }) => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const categories = ['General', 'Technology', 'Sports', 'Business', 'Health', 'Entertainment'];
  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url;
      
      if (searchQuery.trim()) {
        // Search endpoint for search queries
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&apiKey=${API_KEY}`;
      } else {
        // Top headlines by category
        url = `https://newsapi.org/v2/top-headlines?country=us&category=${category.toLowerCase()}&apiKey=${API_KEY}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch news');
      }
      
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch news when category or searchQuery changes
  useEffect(() => {
    fetchNews();
  }, [category, searchQuery]);

  // Smooth scroll to top when category changes
  useEffect(() => {
    if (!searchQuery) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [category]);

  // Show error state
  if (error && !loading) {
    return <ErrorState onRetry={fetchNews} />;
  }

  return (
    <div>
      {/* Categories - Hide when searching */}
      {!searchQuery && (
        <div className="categories">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      )}

      {/* Search Results Header */}
      {searchQuery && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            color: 'var(--text-secondary)'
          }}
        >
          Showing results for "{searchQuery}" • {articles.length} articles found
        </motion.div>
      )}

      {/* News Grid */}
      <motion.div className="news-grid" layout>
        {loading ? (
          // Show 6 skeleton cards while loading
          Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <SkeletonCard />
            </motion.div>
          ))
        ) : articles.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <AnimatePresence mode='popLayout'>
            {articles.map((article, index) => (
              <motion.div
                key={article.url || index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <NewsItem article={article} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default NewsBoard;