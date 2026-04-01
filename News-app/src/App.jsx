import { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app">
      
      {/* 🔝 Navbar */}
      <Navbar onSearch={setSearchQuery} />

      {/* 🧱 Main Content */}
      <main className="app-container">
        <NewsBoard searchQuery={searchQuery} />
      </main>

    </div>
  );
}

export default App;