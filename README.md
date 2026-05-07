# 📰 News App - Enhanced Edition

A modern, production-ready news application built with **React 18** and **Vite**, featuring real-time news from **NewsAPI**.

## ✨ Features

### Core Features
- 🔍 **Real-time News Search** - Powered by NewsAPI
- 📂 **Category Filtering** - Browse by General, Tech, Sports, Business, Health, Entertainment, Science
- 💾 **Save Articles** - Bookmark articles locally with `localStorage`
- 🎯 **Featured Article** - Highlight top story with large preview
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Fast Loading** - Skeleton loaders for smooth UX

### Technical Features
- ✅ **Error Boundaries** - Graceful error handling with component recovery
- ✅ **Custom Hooks** - `useNews` for centralized state management
- ✅ **Pagination** - Load more articles infinitely
- ✅ **Animations** - Smooth transitions with Framer Motion
- ✅ **Search & Filter** - Dynamic filtering with instant results
- ✅ **Trending Sidebar** - Quick access to top articles
- ✅ **Security** - API key via environment variables (never exposed)

## 🚀 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18, Vite 5 |
| **Styling** | Custom CSS + Framer Motion |
| **State** | React Hooks |
| **API** | NewsAPI.org |
| **Package Manager** | npm |

## 📁 Project Structure

```
News-app/
├── src/
│   ├── Components/
│   │   ├── Navbar.jsx           # Navigation & search bar
│   │   ├── NewsBoard.jsx        # Main news grid
│   │   ├── NewsItem.jsx         # Individual article card
│   │   └── ErrorBoundary.jsx    # Error handler (NEW)
│   ├── hooks/
│   │   └── useNews.js           # Custom hook for news logic (NEW)
│   ├── App.jsx                  # Root component
│   ├── App.css                  # Global styles
│   └── main.jsx                 # Entry point
├── .env.example                 # Environment template (NEW)
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── index.html                  # HTML template
```

## 🔧 Setup & Installation

### 1. Prerequisites
- Node.js 16+ (recommended 18+)
- npm or yarn

### 2. Install Dependencies
```bash
cd News-app
npm install
```

### 3. Get NewsAPI Key
1. Visit [newsapi.org](https://newsapi.org)
2. Sign up for free account
3. Copy your API key

### 4. Configure Environment
```bash
# Copy example to actual env file
cp .env.example .env.local

# Edit .env.local and add your API key
VITE_API_KEY=your_newsapi_key_here
```

### 5. Run Development Server
```bash
npm run dev
```
Server runs at: `http://localhost:5173`

### 6. Build for Production
```bash
npm run build
npm run preview
```

## 📖 How It Works

### Architecture
```
┌─────────────────────────────────────┐
│         App (Root)                  │
├─────────────────────────────────────┤
│ Navbar (Search + View Toggle)       │
├─────────────────────────────────────┤
│  ErrorBoundary                      │
│  └─ NewsBoard                       │
│     ├─ Featured Article             │
│     ├─ News Grid                    │
│     │  └─ NewsItem × N              │
│     └─ Sidebar (Trending)           │
└─────────────────────────────────────┘
```

### Data Flow
1. **User Action** → Search/Category/View change
2. **useNews Hook** → Fetches from NewsAPI
3. **State Update** → Articles, loading, error
4. **Component Render** → NewsBoard displays results
5. **Error Boundary** → Catches rendering errors
6. **Save Action** → Stores to localStorage

### Key Functions

#### `useNews()` Custom Hook
```javascript
const { articles, loading, error, fetchNews } = useNews();

fetchNews(category, searchQuery, page);
// Returns: articles[], loading bool, error string, pagination info
```

#### Error Handling
- API errors caught and displayed
- Component errors caught by ErrorBoundary
- Network errors show retry button
- Missing API key detected early

#### LocalStorage for Saved Articles
```javascript
localStorage.getItem('savedNews')   // Load saved articles
localStorage.setItem('savedNews')   // Save articles
```

## 🎨 Component Features

### NewsBoard Component
- **Dynamic Categories** - Click to filter by topic
- **Featured Section** - Showcase top article
- **Grid Layout** - Responsive card grid
- **Pagination** - "Load More" button
- **Skeleton Loaders** - Loading state UI
- **Trending Sidebar** - Quick access panel
- **Empty States** - Helpful messages when no results

### NewsItem Component
- **Card Layout** - Image + content + metadata
- **Read More Link** - External link to article
- **Save Button** - Bookmark with localStorage
- **Source Badge** - Article source display

### Error Boundary
- **Catches Errors** - Prevents white screen crashes
- **Shows Message** - User-friendly error text
- **Reload Option** - Quick recovery action

## 🔐 Security & Best Practices

✅ **API Key Protection**
- Never hardcode keys in source
- Use `.env.local` (git-ignored)
- Example: `.env.example` for documentation

✅ **Data Validation**
- Filters out invalid articles
- Checks required fields (title, url, image)
- Removes "[Removed]" entries (blocked articles)

✅ **Error Handling**
- Try-catch in async operations
- Error Boundary for React errors
- User-friendly error messages

✅ **Performance**
- Lazy loading for images
- Pagination to limit data
- Debounced search (optional enhancement)
- Memoized callbacks

## 🚀 Future Enhancements

- [ ] Backend proxy for secure API calls
- [ ] Progressive Web App (PWA) support
- [ ] Offline reading capability
- [ ] Dark/Light theme toggle
- [ ] Article sharing to social media
- [ ] Read time estimation
- [ ] Personalized news preferences
- [ ] Multi-language support
- [ ] Advanced filters (date range, language)
- [ ] Notifications for breaking news

## 🐛 Troubleshooting

### "API Error: 401"
**Cause**: Invalid or missing API key
**Solution**: 
1. Check `.env.local` file exists
2. Verify key in newsapi.org dashboard
3. Ensure key is copied exactly

### "No articles found"
**Cause**: Search term has no results OR rate limit hit
**Solution**:
1. Try different search term
2. Wait 15 minutes (free tier rate limit)
3. Upgrade to paid plan on newsapi.org

### "Failed to fetch news"
**Cause**: Network error or CORS issue
**Solution**:
1. Check internet connection
2. Try with VPN if blocked
3. Check browser console for details

### Blank Page
**Cause**: React error or missing dependencies
**Solution**:
1. Check browser console (F12)
2. Run `npm install` again
3. Clear node_modules and reinstall

## 📊 API Endpoints Used

### Top Headlines
```
GET https://newsapi.org/v2/top-headlines?country=us&category={category}&pageSize={size}&page={page}&apiKey={key}
```

### Everything (Search)
```
GET https://newsapi.org/v2/everything?q={query}&sortBy=publishedAt&pageSize={size}&page={page}&apiKey={key}
```

## 📝 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 📜 License

Open source. Free to use for learning and development.

---

**Last Updated**: May 7, 2024
**Maintained By**: Portfolio Projects Team
