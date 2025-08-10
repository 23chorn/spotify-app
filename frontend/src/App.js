import React, { useEffect, useState } from 'react';

// Set this to your backend URL
const BACKEND_URL = 'http://127.0.0.1:3001';

function App() {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/auth/status`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setLoggedIn(data.loggedIn))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleLogout = () => {
    fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => setLoggedIn(false))
      .catch(console.error);
  };

  if (loggedIn === null) return <p>Loading...</p>;

  if (!loggedIn) {
    return (
      <div>
        <h2>You are not logged in.</h2>
        <a href={`${BACKEND_URL}/auth/login`}>
          <button>Login with Spotify</button>
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, you are logged in!</h1>
      <p>You can now explore Spotify features.</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default App;