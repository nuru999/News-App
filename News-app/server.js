import express from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT) || 3001;
const apiKey = process.env.NEWS_API_KEY?.trim();
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(rootDir, 'dist');
const categories = new Set(['general', 'technology', 'sports', 'business', 'health', 'entertainment', 'science']);

app.disable('x-powered-by');
app.use((request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use('/api/news', rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again shortly.' },
}));

app.get('/api/news', async (request, response) => {
  if (!apiKey) return response.status(503).json({ error: 'News service is not configured.' });

  const query = typeof request.query.q === 'string' ? request.query.q.trim() : '';
  const category = categories.has(request.query.category) ? request.query.category : 'general';
  const page = Math.min(Math.max(Number.parseInt(request.query.page, 10) || 1, 1), 20);
  const pageSize = Math.min(Math.max(Number.parseInt(request.query.pageSize, 10) || 12, 1), 20);

  if (query.length > 120) return response.status(400).json({ error: 'Search query is too long.' });

  const endpoint = query ? 'everything' : 'top-headlines';
  const url = new URL(`https://newsapi.org/v2/${endpoint}`);
  if (query) {
    url.searchParams.set('q', query);
    url.searchParams.set('sortBy', 'publishedAt');
  } else {
    url.searchParams.set('country', 'us');
    url.searchParams.set('category', category);
  }
  url.searchParams.set('page', String(page));
  url.searchParams.set('pageSize', String(pageSize));

  try {
    const upstream = await fetch(url, {
      headers: { 'X-Api-Key': apiKey },
      signal: AbortSignal.timeout(8000),
    });
    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok || data.status === 'error') {
      console.error('NewsAPI request failed', upstream.status, data.code || 'unknown');
      return response.status(502).json({ error: 'News service is temporarily unavailable.' });
    }

    response.setHeader('Cache-Control', 'public, max-age=300');
    return response.json({ status: 'ok', totalResults: data.totalResults, articles: data.articles || [] });
  } catch (error) {
    console.error('NewsAPI request error', error.name);
    return response.status(504).json({ error: 'News service timed out.' });
  }
});

app.get('/api/health', (request, response) => response.json({ ok: true, newsConfigured: Boolean(apiKey) }));

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, { index: false, maxAge: '1h' }));
  app.get('*', (request, response) => {
    if (request.path.startsWith('/api/')) return response.status(404).json({ error: 'API route not found.' });
    return response.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  app.use((request, response) => response.status(503).json({ error: 'Frontend build is unavailable.' }));
}

app.listen(port, '0.0.0.0', () => {
  console.log(`NewsMag listening on port ${port}`);
});
