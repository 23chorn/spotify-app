import React from 'react';
import { useAuthStatus } from './hooks/useAuthStatus';
import { useSpotifyData } from './hooks/useSpotifyData';
import AuthStatus from './components/AuthStatus';
import Profile from './components/Profile';
import TopArtists from './components/TopArtists';
import LoadingButton from './components/LoadingButton';

const BACKEND_URL = 'http://127.0.0.1:3001';

function App() {
  const { loggedIn, logout } = useAuthStatus();
  const {
    profile,
    loadingProfile,
    topArtists,
    loadingArtists,
    error,
    loadProfile,
    loadTopArtists,
  } = useSpotifyData();

  if (loggedIn === null) return <p>Loading...</p>;

  if (!loggedIn) {
    return <AuthStatus loggedIn={loggedIn} backendUrl={BACKEND_URL} />;
  }

  return (
    <div>
      <h1>Welcome, you are logged in!</h1>

      <LoadingButton onClick={loadProfile} loading={loadingProfile}>
        Load Profile
      </LoadingButton>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <Profile profile={profile} />

      <LoadingButton
        onClick={loadTopArtists}
        loading={loadingArtists}
        style={{ marginTop: '20px' }}
      >
        Load Top Artists
      </LoadingButton>

      <TopArtists artists={topArtists} />

      <button onClick={logout} style={{ marginTop: '20px' }}>
        Log out
      </button>
    </div>
  );
}

export default App;