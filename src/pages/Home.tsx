import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Monster Duel Arena</h1>
      <p className="text-xl mb-8">Collect, train, and battle with unique monsters!</p>
      <Link
        to="/arena"
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Enter the Arena
      </Link>
    </div>
  );
};

export default Home;