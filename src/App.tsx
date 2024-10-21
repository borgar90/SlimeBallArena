import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Matchmaking from './pages/Matchmaking';
import Arena from './pages/Arena';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import { Language } from './utils/translations';

function App() {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header language={language} setLanguage={setLanguage} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/matchmaking" element={<Matchmaking />} />
            <Route path="/arena/:matchId" element={<Arena language={language} />} />
            <Route path="/leaderboard" element={<Leaderboard language={language} />} />
            <Route path="/profile" element={<Profile language={language} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;