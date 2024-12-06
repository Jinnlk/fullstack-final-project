import React from 'react';
import './Mood.css';

function Mood({ profile, mood, calculateMood }) {
  return (
    <div className="mood-container">
      {profile ? (
        <>
          <div className="profile-section">
            <img
              src={profile.images[0]?.url || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="profile-image"
            />
          </div>
          <div className="mood-details">
            <h2 className="welcome-text">Welcome, {profile.display_name}!</h2>
            <p className="mood-text">Your mood is: <strong>{mood || '...'}</strong></p>
            <button onClick={calculateMood} className="mood-button">Find Your Mood</button>
          </div>
        </>
      ) : (
        <div className="unauthenticated-message">
          <h2 className="unauthenticated-text">Log in first to view your mood!</h2>
        </div>
      )}
    </div>
  );
}

export default Mood;
