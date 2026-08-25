import { useState, useCallback, useEffect } from 'react';

const useNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const PAGE_SIZE = 12;

  const fetchNews = useCallback(async (category = 'general', searchQuery = '', pageNum = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ pageSize: String(PAGE_SIZE), page: String(pageNum) });
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      else params.set('category', category.toLowerCase());
      const url = `/api/news?${params.toString()}`;

      const response = await fetch(url);

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `API Error: ${response.status}`);

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch news');
      }

      // Filter out invalid articles
      const validArticles = (data.articles || []).filter(article => 
        article.title && 
        article.url && 
        article.title !== '[Removed]' &&
        article.urlToImage
      );

      setArticles(prev => pageNum === 1 ? validArticles : [...prev, ...validArticles]);
      setHasMore(data.totalResults > pageNum * PAGE_SIZE);
      setPage(pageNum);

    } catch (err) {
      console.error('News fetch error:', err);
      setError(err.message || 'Failed to load news. Please try again.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetNews = useCallback(() => {
    setArticles([]);
    setError(null);
    setPage(1);
    setHasMore(false);
  }, []);

  return {
    articles,
    loading,
    error,
    page,
    hasMore,
    fetchNews,
    resetNews,
    setArticles
  };
};

export default useNews;
