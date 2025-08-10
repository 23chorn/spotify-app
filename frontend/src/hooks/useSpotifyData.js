import { useState } from 'react';

const BACKEND_URL = 'http://127.0.0.1:3001';

export function useSpotifyData() {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [topArtists, setTopArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(false);

  const [error, setError] = useState('');

  const loadProfile = () => {
    setLoadingProfile(true);
    fetch(`${BACKEND_URL}/api/profile`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setError('');
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoadingProfile(false));
  };

  const loadTopArtists = () => {
    setLoadingArtists(true);
    fetch(`${BACKEND_URL}/api/top-artists`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch top artists');
        return res.json();
      })
      .then(data => {
        setTopArtists(data);
        setError('');
      })
      .catch(() => setError('Failed to load top artists'))
      .finally(() => setLoadingArtists(false));
  };

  return {
    profile,
    loadingProfile,
    topArtists,
    loadingArtists,
    error,
    loadProfile,
    loadTopArtists,
  };
}