import React from 'react';
import './Home.css';

function Home({ login }) {
  return (
    <div className="home-container">
      <h1 className="heading">Spotify Mood Ring</h1>
      <p className="description">A personality evaluator based on the songs you’ve been listening to!</p>
      <button onClick={login} className="spotify-button">Find Your Mood</button>
    </div>
  );
}

export default Home;
