import { motion, AnimatePresence } from 'framer-motion';
import NewsItem from './NewsItem';
import { useState, useEffect } from 'react';

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
      Check your internet or API key
    </p>
    <button onClick={onRetry} className="read-more">Try Again</button>
  </div>
);

const EmptyState = ({ searchQuery }) => (
  <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
    <h3>No articles found</h3>
    <p style={{ color: 'var(--text-secondary)' }}>
      {searchQuery
        ? `No results for "${searchQuery}"`
        : 'No news available'}
    </p>
  </div>
);

/* ---------------- Main ---------------- */
const NewsBoard = ({ searchQuery = '' }) => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['General', 'Technology', 'Sports', 'Business', 'Health', 'Entertainment'];
  const API_KEY = import.meta.env.VITE_API_KEY;

  /* 🔥 RESET ARTICLES WHEN CONTEXT CHANGES */
  useEffect(() => {
    setArticles([]);
  }, [category, searchQuery]);

  /* 🔥 FETCH NEWS */
  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      let url;

      if (searchQuery.trim()) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          searchQuery
        )}&sortBy=publishedAt&apiKey=${API_KEY}`;
      } else {
        url = `https://newsapi.org/v2/top-headlines?country=us&category=${category.toLowerCase()}&apiKey=${API_KEY}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'error') throw new Error(data.message);

      const validArticles = (data.articles || []).filter(
        (a) => a.title && a.url && a.urlToImage
      );

      setArticles(validArticles);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 FETCH WHEN DEPENDENCIES CHANGE */
  useEffect(() => {
    fetchNews();
  }, [category, searchQuery]);

  if (error && !loading) {
    return <ErrorState onRetry={fetchNews} />;
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
              className={`category-btn ${
                category === cat.toLowerCase() ? 'active' : ''
              }`}
              onClick={() => setCategory(cat)}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      )}

      {/* 🔍 SEARCH HEADER */}
      {searchQuery && !loading && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Results for "<b>{searchQuery}</b>" • {articles.length}
        </div>
      )}

      {/* 🔥 FEATURED ARTICLE */}
      {!loading && featured && (
        <motion.section
          className="featured"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={featured.urlToImage} alt="" />
          <div className="featured-content">
            <span>{featured.source?.name}</span>
            <h1>{featured.title}</h1>
            <p>{featured.description}</p>
          </div>
        </motion.section>
      )}

      {/* 🧱 MAIN LAYOUT */}
      <div className="main-layout">

        {/* 📰 GRID */}
        <motion.div className="news-grid" layout>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : rest.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <AnimatePresence mode="popLayout">
              {rest.map((article, index) => (
                <motion.div
                  key={article.url || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <NewsItem article={article} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* 📈 SIDEBAR */}
        {!loading && articles.length > 0 && (
          <aside className="sidebar">
            <h3>🔥 Trending</h3>

            {articles.slice(0, 5).map((item, i) => (
              <div key={i} className="trending-item">
                <span>{i + 1}</span>
                <p>{item.title}</p>
              </div>
            ))}
          </aside>
        )}

      </div>
    </div>
  );
};

export default NewsBoard;