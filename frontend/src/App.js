import React, { useState, useEffect } from 'react';
import './App.css'; // Your existing CSS file

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Extract the access token from the URL hash after authentication
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');
    console.log("TOKEN", token)

    if (token) {
      setAccessToken(token);
      fetchProfile(token); // Fetch user profile once we have the token
    }
  }, []);

  // Fetch the Spotify profile using the access token
  async function fetchProfile(token) {
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
  }
  

  // Logout function to reset the app state
  const logout = () => {
    setAccessToken(null);
    setProfile(null); 
    window.location.hash = '';
    window.location.href = '/';
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="header">
          <h1 className="title">Mood Ring</h1>
          <p className="subtitle">Discover your mood through your Spotify listening history</p>
        </div>

        {!accessToken ? (
          // Login button redirects to the backend login route
          <a href="http://localhost:8888/login" className="spotify-button">
            Connect with Spotify
          </a>
        ) : (
          <div className="profile-container">
            {profile ? (
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
                  <p>
                    <strong>Spotify ID:</strong> {profile.id}
                  </p>
                  <a href={profile.external_urls.spotify} target="_blank" rel="noreferrer">
                    View Spotify Profile
                  </a>
                </div>
                <button onClick={logout} className="logout-button">
                  Logout
                </button>
              </>
            ) : (
              <p>Loading your profile...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
