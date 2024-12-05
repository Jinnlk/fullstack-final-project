import React, { useState, useEffect } from 'react';
import './App.css';



function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mood, setMood] = useState(null);

  useEffect(() => {
    // Check if there's an access token in the URL hash after Spotify login
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (token) {
      setAccessToken(token);
      fetchProfile(token); // Fetch user profile once we have the token
      window.location.hash = ''; // Clear the URL hash after extracting the token
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data); // Store profile data in state
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchRecentTracks = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch recently played tracks');
      }
  
      const data = await response.json();
  
      // Map to song names and artists
      const tracks = data.items.map((item) => ({
        name: item.track.name,
        artist: item.track.artists.map((artist) => artist.name).join(', '),
      }));
  
      console.log('Fetched Tracks:', tracks);
      return tracks;
    } catch (error) {
      console.error('Error fetching recent tracks:', error);
    }
  };

  const generateChatGPTPrompt = (tracks) => {
    const trackList = tracks.map((track, index) => `${index + 1}. "${track.name}" by ${track.artist}`).join('\n');
  
    return `Based on the following recently played songs, generate a 2-3 word mood or vibe to describe this user's music taste:
    
    ${trackList}
    
    Provide a creative and engaging response.`;
  };

  const calculateMood = async () => {
    try {
      const tracks = await fetchRecentTracks(accessToken);
      if (!tracks || tracks.length === 0) {
        setMood('No tracks found. Try listening to some music first!');
        return;
      }

      console.log('OpenAI API Key:', process.env.REACT_APP_OPENAI_API_KEY);
  
      const prompt = generateChatGPTPrompt(tracks);
      const mood = await fetchMoodFromChatGPT(prompt);
      setMood(mood);
    } catch (error) {
      console.error('Error calculating mood:', error);
      setMood('Something went wrong. Please try again.');
    }
  };
  
  
  

  const fetchMoodFromChatGPT = async (prompt) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Add your OpenAI API key here
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: 'You are a creative mood generator.' }, { role: 'user', content: prompt }],
          max_tokens: 100,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch mood from ChatGPT');
      }
  
      const data = await response.json();
      const mood = data.choices[0].message.content;
      console.log('Generated Mood:', mood);
      return mood;
    } catch (error) {
      console.error('Error fetching mood from ChatGPT:', error);
    }
  };

  

  const login = () => {
    // Redirect user to the backend's /login route
    window.location.href = 'http://localhost:8888/login';
  };

  const logout = () => {
    // Clear all stored state and redirect user to the original page
    setAccessToken(null); // Clear the access token
    setProfile(null); // Clear the profile data
    setMood(null); // Clear mood data
    window.location.hash = ''; // Clear the URL hash
    window.location.href = '/'; // Redirect to the original page for re-authentication
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="header">
          <h1 className="title">Mood Ring</h1>
          <p className="subtitle">Discover your mood through your Spotify listening history</p>
        </div>

        {!accessToken ? (
          <button onClick={login} className="spotify-button">
            Connect with Spotify
          </button>
        ) : (
          <div className="profile-container">
            {profile && (
              <>
                <div className="profile-header">
                  <img
                    src={profile.images?.[0]?.url || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="profile-image"
                  />
                  <h2 className="profile-name">Welcome, {profile.display_name}!</h2>
                </div>
                <div className="profile-info">
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                  <p>
                    <strong>Country:</strong> {profile.country}
                  </p>
                  <a href={profile.external_urls.spotify} target="_blank" rel="noreferrer">
                    View Spotify Profile
                  </a>
                </div>
              </>
            )}
            {mood ? (
              <div className="mood-result">
                <h2>Your mood is: {mood}</h2>
              </div>
            ) : (
              <button onClick={calculateMood} className="calculate-mood-button">
                Calculate My Mood
              </button>
            )}
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
