import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';

// Set this to your backend LocalTunnel HTTPS URL
const BACKEND_URL = 'http://localhost:3001';

function LoginPage() {
  return (
    <div>
      <h2>You are not logged in.</h2>
      {/* Use backend LocalTunnel URL for Spotify login */}
      <a href={`${BACKEND_URL}/auth/login`}>
        <button>Login with Spotify</button>
      </a>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Welcome, you are logged in!</h1>
      <p>You can now explore Spotify features.</p>
      {/* Simple log out: reloads page and resets session */}
      <Link to="/" onClick={() => window.location.reload()}>Log out</Link>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/auth/status`, {
      credentials: 'include', // important to send cookies
    })
      .then(res => res.json())
      .then(data => setLoggedIn(data.loggedIn))
      .catch(() => setLoggedIn(false));
  }, []);

  if (loggedIn === null) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/home" replace /> : <LoginPage />}
        />
        <Route
          path="/home"
          element={loggedIn ? <Home /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;