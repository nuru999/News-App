import { useState } from 'react';
import './App.css'; 
import Navbar from './Components/Navbar';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <Navbar onSearch={setSearchQuery} />
      <NewsBoard searchQuery={searchQuery} />
    </div>
  );
}

export default App;