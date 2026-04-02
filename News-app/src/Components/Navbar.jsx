// Navbar.jsx - Enhanced with mobile improvements
import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Menu, X, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onSearch, onViewChange, view }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => onSearch(query), 500);
    return () => clearTimeout(delay);
  }, [query, onSearch]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <div className="nav-left">
         <img src="/logo.svg" alt="NewsMag" style={{ height: '40px', width: 'auto' }} />

          <div className="view-toggle desktop-only">
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
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search news..."
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button 
                onClick={() => setQuery('')} 
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            className="icon-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            className="icon-btn mobile-only" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            <button
              className={`mobile-nav-item ${view === 'home' ? 'active' : ''}`}
              onClick={() => {
                onViewChange('home');
                setMobileMenuOpen(false);
              }}
            >
              Home
            </button>
            <button
              className={`mobile-nav-item ${view === 'saved' ? 'active' : ''}`}
              onClick={() => {
                onViewChange('saved');
                setMobileMenuOpen(false);
              }}
            >
              <Bookmark size={16} /> Saved Articles
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;