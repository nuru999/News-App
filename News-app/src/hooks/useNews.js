import { useState, useCallback, useEffect } from 'react';

const useNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY || 'YOUR_API_KEY_HERE';
  const PAGE_SIZE = 12;
  const BASE_URL = 'https://newsapi.org/v2';

  const fetchNews = useCallback(async (category = 'general', searchQuery = '', pageNum = 1) => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      setError('Please configure your NewsAPI key in .env.local');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url;

      if (searchQuery.trim()) {
        url = `${BASE_URL}/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&pageSize=${PAGE_SIZE}&page=${pageNum}&apiKey=${API_KEY}`;
      } else {
        url = `${BASE_URL}/top-headlines?country=us&category=${category.toLowerCase()}&pageSize=${PAGE_SIZE}&page=${pageNum}&apiKey=${API_KEY}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

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
  }, [API_KEY]);

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
