// NewsBoard.jsx - Fixed and Enhanced
import { motion, AnimatePresence } from 'framer-motion';
import NewsItem from './NewsItem';
import { useState, useEffect, useCallback } from 'react';

/* ---------------- Skeleton ---------------- */
const SkeletonCard = () => (
  <div className="news-card">
    <div className="skeleton" style={{ height: '220px' }} />
    <div style={{ padding: '1.5rem' }}>
      <div className="skeleton" style={{ height: '20px', width: '30%', marginBottom: '1rem', borderRadius: '9999px' }} />
      <div className="skeleton" style={{ height: '28px', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '60px', marginBottom: '1.5rem' }} />
      <div className="skeleton" style={{ height: '40px', width: '120px', borderRadius: '0.5rem' }} />
    </div>
  </div>
);

/* ---------------- States ---------------- */
const ErrorState = ({ onRetry }) => (
  <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
    <h3>Failed to load news</h3>
    <p style={{ color: 'var(--text-secondary)' }}>
      Check your internet connection or try again later
    </p>
    <button onClick={onRetry} className="read-more">Try Again</button>
  </div>
);

const EmptyState = ({ message, submessage }) => (
  <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
    <h3>{message}</h3>
    <p style={{ color: 'var(--text-secondary)' }}>{submessage}</p>
  </div>
);

/* ---------------- Main ---------------- */
const NewsBoard = ({ searchQuery = '', view = 'home' }) => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);

  const categories = ['General', 'Technology', 'Sports', 'Business', 'Health', 'Entertainment', 'Science'];
  
  // ⚠️ SECURITY: Never expose API keys in frontend code for production!
  // Use environment variables or backend proxy
  const API_KEY = import.meta.env.VITE_API_KEY || 'YOUR_API_KEY_HERE';
  const PAGE_SIZE = 12;

  const loadSavedArticles = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedNews') || '[]');
      setSavedArticles(saved);
    } catch (e) {
      console.error('Error loading saved articles:', e);
      setSavedArticles([]);
    }
  }, []);

  /* ✨ DATA RESET ON CONTEXT CHANGES */
  useEffect(() => {
    setPage(1);
    setArticles([]);
    setError(null);
    setHasMore(false);
  }, [category, searchQuery, view]);

  /* 📥 FETCH SAVED ON SAVED VIEW */
  useEffect(() => {
    if (view === 'saved') {
      setLoading(true);
      loadSavedArticles();
      setLoading(false);
    }
  }, [view, loadSavedArticles]);

  const fetchNews = useCallback(async () => {
    if (view !== 'home') return;

    setLoading(true);
    setError(null);

    try {
      let url;
      const baseUrl = 'https://newsapi.org/v2';
      
      if (searchQuery.trim()) {
        url = `${baseUrl}/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&pageSize=${PAGE_SIZE}&page=${page}&apiKey=${API_KEY}`;
      } else {
        url = `${baseUrl}/top-headlines?country=us&category=${category.toLowerCase()}&pageSize=${PAGE_SIZE}&page=${page}&apiKey=${API_KEY}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'API Error');
      }

      const validArticles = (data.articles || []).filter((a) => 
        a.title && a.url && a.title !== '[Removed]'
      );

      setArticles((prev) => (page === 1 ? validArticles : [...prev, ...validArticles]));
      setHasMore(data.totalResults > (page * PAGE_SIZE));

      if (page === 1 && validArticles.length === 0) {
        setError('No matching articles found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [API_KEY, category, page, searchQuery, view]);

  useEffect(() => {
    if (view === 'home' && API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') {
      fetchNews();
    } else if (view === 'home' && (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE')) {
      setError('Please add your NewsAPI key to the .env file');
      setLoading(false);
    }
  }, [fetchNews, view, API_KEY]);

  if (error && !loading && articles.length === 0) {
    return <ErrorState onRetry={fetchNews} />;
  }

  if (view === 'saved') {
    return (
      <div className="app-container">
        <h2 style={{ padding: '2rem 2rem 1rem' }}>Saved Articles</h2>
        
        {loading ? (
          <div className="news-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : savedArticles.length === 0 ? (
          <EmptyState 
            message="No saved articles yet" 
            submessage="Save articles by clicking the bookmark icon on any news card."
          />
        ) : (
          <div className="news-grid">
            <AnimatePresence mode="popLayout">
              {savedArticles.map((article, i) => (
                <motion.div 
                  key={`${article.url}-${i}`} 
                  initial={{ opacity: 0, y: 12 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <NewsItem article={article} onSavedChange={loadSavedArticles} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="app-container">
      {/* 🏷️ CATEGORIES */}
      {!searchQuery && (
        <div className="categories">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              className={`category-btn ${category === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => setCategory(cat.toLowerCase())}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      )}

      {/* 🔍 SEARCH HEADER */}
      {searchQuery && !loading && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          Results for "<b>{searchQuery}</b>" • {articles.length} articles
        </div>
      )}

      {/* 🔥 FEATURED ARTICLE */}
      {!loading && featured && featured.urlToImage && (
        <motion.section 
          className="featured" 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={featured.urlToImage} alt={featured.title} />
          <div className="featured-content">
            <span>{featured.source?.name}</span>
            <h1>{featured.title}</h1>
            <p>{featured.description}</p>
            <a 
              href={featured.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="read-more"
              style={{ marginTop: '1rem' }}
            >
              Read Full Story <span style={{ marginLeft: '0.5rem' }}>→</span>
            </a>
          </div>
        </motion.section>
      )}

      {/* 🧱 MAIN LAYOUT */}
      <div className="main-layout">
        {/* 📰 GRID */}
        <motion.div className="news-grid" layout>
          {loading && page === 1 ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : rest.length === 0 && !loading ? (
            <EmptyState 
              message="No articles found" 
              submessage="Try adjusting your search or category filters."
            />
          ) : (
            <AnimatePresence mode="popLayout">
              {rest.map((article, index) => (
                <motion.div 
                  key={article.url || index} 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NewsItem article={article} onSavedChange={loadSavedArticles} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {/* Loading more indicator */}
          {loading && page > 1 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <div className="skeleton" style={{ height: '40px', width: '200px', margin: '0 auto' }} />
            </div>
          )}
        </motion.div>

        {/* 📈 SIDEBAR */}
        {!loading && articles.length > 0 && (
          <aside className="sidebar">
            <h3>🔥 Trending Now</h3>
            {articles.slice(0, 5).map((item, i) => (
              <div key={i} className="trending-item" onClick={() => window.open(item.url, '_blank')}>
                <span>{i + 1}</span>
                <p>{item.title}</p>
              </div>
            ))}
          </aside>
        )}
      </div>

      {/* 📦 LOAD MORE */}
      {!loading && hasMore && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <button 
            className="read-more" 
            onClick={() => setPage((p) => p + 1)}
            style={{ minWidth: '150px' }}
          >
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsBoard;