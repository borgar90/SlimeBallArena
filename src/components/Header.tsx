import React from 'react';
import { Link } from 'react-router-dom';
import { Sword, Trophy, User, Users } from 'lucide-react';
import { Language, useTranslation } from '../utils/translations';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const t = useTranslation(language);

  return (
    <header className="bg-gray-800 py-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-400">
          SlimeBall Duels
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/matchmaking" className="flex items-center text-gray-300 hover:text-white">
              <Users className="mr-2" size={20} />
              {t('matchmaking')}
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className="flex items-center text-gray-300 hover:text-white">
              <Trophy className="mr-2" size={20} />
              {t('leaderboard')}
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center text-gray-300 hover:text-white">
              <User className="mr-2" size={20} />
              {t('playerProfile')}
            </Link>
          </li>
        </ul>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-gray-700 text-white px-2 py-1 rounded"
        >
          <option value="en">English</option>
          <option value="no">Norsk</option>
        </select>
      </nav>
    </header>
  );
};

export default Header;