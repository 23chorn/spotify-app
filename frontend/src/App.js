import React, { useEffect, useState } from 'react';

// Set this to your backend URL
const BACKEND_URL = 'http://127.0.0.1:3001';

function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState('');
  const [topArtists, setTopArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/auth/status`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setLoggedIn(data.loggedIn))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleLoadProfile = () => {
    setLoadingProfile(true);
    fetch(`${BACKEND_URL}/api/spotify/profile`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setError('');
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load profile');
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  };

  const handleLoadTopArtists = () => {
    setLoadingArtists(true);
    fetch(`${BACKEND_URL}/api/top-artists`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch top artists');
        return res.json();
      })
      .then(data => {
        setTopArtists(data);
        setError('');
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load top artists');
      })
      .finally(() => {
        setLoadingArtists(false);
      });
  };

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
    <button onClick={handleLoadProfile} disabled={loadingProfile}>
      {loadingProfile ? 'Loading Profile...' : 'Load Profile'}
    </button>
    {error && <p style={{ color: 'red' }}>Error: {error}</p>}

    {profile && (
      <div
        style={{
          textAlign: 'left',
          backgroundColor: '#eee',
          padding: '10px',
          borderRadius: '5px',
          maxHeight: '400px',
          overflowY: 'auto',
          wordBreak: 'break-word',
          marginTop: '20px',
        }}
      >
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {Object.entries(profile).map(([key, value]) => {
            // Format nested objects nicely
            let displayValue;
            if (typeof value === 'object' && value !== null) {
              displayValue = JSON.stringify(value, null, 2);
            } else {
              displayValue = String(value);
            }
            return (
              <li key={key} style={{ marginBottom: '8px' }}>
                <strong>{key}:</strong>
                <pre
                  style={{
                    display: 'inline',
                    margin: 0,
                    paddingLeft: '8px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {displayValue}
                </pre>
              </li>
            );
          })}
        </ul>
      </div>
    )}

    <button onClick={handleLoadTopArtists} disabled={loadingArtists} style={{ marginTop: '20px' }}>
        {loadingArtists ? 'Loading Top Artists...' : 'Load Top Artists'}
      </button>

      {topArtists && (
        <ul style={{ textAlign: 'left', marginTop: '10px' }}>
          {topArtists.map(artist => (
            <li key={artist.id}>
              <strong>{artist.name}</strong> (Genres: {artist.genres.join(', ')})
            </li>
          ))}
        </ul>
      )}

    <button onClick={handleLogout} style={{ marginTop: '20px' }}>
      Log out
    </button>
  </div>
);
}

export default App;