import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Menu } from 'lucide-react';

const Navbar = ({ onSearch, onViewChange, view }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState('');

  /* 🌙 Dark Mode */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  /* 📜 Scroll Effect */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* 🔍 LIVE SEARCH (Debounce for performance) */
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(query);
    }, 500); // waits 0.5s after typing

    return () => clearTimeout(delay);
  }, [query, onSearch]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">

        <div className="nav-left">
          <h1 className="logo">NewsMag</h1>

          <div className="view-toggle">
            <button
              className={`toggle-btn ${view === 'home' ? 'active' : ''}`}
              onClick={() => onViewChange('home')}
            >
              Home
            </button>
            <button
              className={`toggle-btn ${view === 'saved' ? 'active' : ''}`}
              onClick={() => onViewChange('saved')}
            >
              Saved
            </button>
          </div>
        </div>

        <div className="nav-right">

          {/* 🔍 SEARCH */}
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search news..."
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* 🌙 DARK MODE */}
          <button
            className="icon-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* 📱 MOBILE MENU (future use) */}
          <button className="icon-btn mobile-only">
            <Menu size={18} />
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;