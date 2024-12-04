import React, { useState, useEffect } from 'react';

function App() {
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSpotifyLogin = () => {
    setIsLoggedIn(true);
    analyzeMood();
  };

  const analyzeMood = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMood('peaceful');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="header">
          <h1 className="title">Mood Ring</h1>
          <p className="subtitle">
            Discover your mood through your Spotify listening history
          </p>
        </div>

        {!isLoggedIn ? (
          <button onClick={handleSpotifyLogin} className="spotify-button">
            <span>Connect with Spotify</span>
          </button>
        ) : (
          <div className="mood-card">
            {isLoading ? (
              <div className="loading-animation">
                <div className="loading-circle"></div>
                <p className="loading-text">Analyzing your music...</p>
              </div>
            ) : (
              <>
                <div className="mood-circle">
                  <span className="text-2xl">✨</span>
                </div>
                <h2 className="mood-title">
                  You're feeling {mood}
                </h2>
                <p className="mood-description">
                  Based on your recent listening history, your music suggests a {mood} mood
                </p>
                <button onClick={analyzeMood} className="analyze-button">
                  Analyze Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
