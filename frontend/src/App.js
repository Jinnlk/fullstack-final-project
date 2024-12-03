import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState(''); // State to store the backend response

  useEffect(() => {
    // Fetch data from the backend
    fetch('/api/test')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching backend data:', error));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to My Website</h1>
      <p>This is a simple template to test the connection between the frontend and backend.</p>
      <h2>Backend Response:</h2>
      <p>{message || 'Fetching data...'}</p>
    </div>
  );
}

export default App;
