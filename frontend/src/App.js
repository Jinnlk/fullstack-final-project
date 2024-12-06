import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Mood from './components/Mood';
import About from './components/About';
import { fetchProfile, fetchRecentTracks } from './utils/spotifyApi';
import { fetchMoodFromChatGPT } from './utils/chatgptApi';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mood, setMood] = useState(null);

  // Check and extract access token on load
  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (token) {
      setAccessToken(token);
      fetchProfile(token).then((data) => setProfile(data));
      window.location.hash = ''; // Clear hash after extracting the token
    }
  }, []);

  const calculateMood = async () => {
    try {
      const tracks = await fetchRecentTracks(accessToken);
      if (!tracks || tracks.length === 0) {
        setMood('No tracks found. Try listening to some music first!');
        return;
      }

      const prompt = `Based on the following recently played songs, generate a 2-3 word mood or vibe to describe this user's music taste:\n\n${tracks
        .map((t, i) => `${i + 1}. "${t.name}" by ${t.artist}`)
        .join('\n')}\n\nProvide a creative and engaging response.`;

      const mood = await fetchMoodFromChatGPT(prompt);
      setMood(mood);
    } catch (error) {
      console.error('Error calculating mood:', error);
      setMood('Something went wrong. Please try again.');
    }
  };

  const login = () => {
    window.location.href = 'http://localhost:8888/login';
  };

  const logout = () => {
    setAccessToken(null);
    setProfile(null);
    setMood(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home login={login} />} />
          <Route path="/mood" element={<Mood profile={profile} mood={mood} calculateMood={calculateMood} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
