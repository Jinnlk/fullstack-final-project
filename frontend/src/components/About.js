import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1 className="about-heading">About Mood Ring</h1>
      <p className="about-text">
        Inspired by a love for music and technology, this app evaluates your personality
        based on your Spotify listening history.
      </p>
    </div>
  );
}

export default About;
