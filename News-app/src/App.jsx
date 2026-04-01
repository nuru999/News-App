import { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('home'); // 'home' or 'saved'

  return (
    <div className="app">
      
      {/* 🔝 Navbar */}
      <Navbar
        onSearch={setSearchQuery}
        onViewChange={setView}
        view={view}
      />

      {/* 🧱 Main Content */}
      <main className="app-container">
        <NewsBoard searchQuery={searchQuery} view={view} />
      </main>

    </div>
  );
}

export default App;
