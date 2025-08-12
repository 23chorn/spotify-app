import React, { useState, useEffect } from 'react';
import { useAuthStatus } from './hooks/useAuthStatus';
import TopTracksList from './components/TopTracksList';
import TopArtistsList from './components/TopArtistsList';
import FetchOptions from './components/FetchOptions';
import ProfileHeader from './components/ProfileHeader';
import RecentlyPlayedList from './components/RecentlyPlayedList';
import RecentlyPlayedOptions from './components/RecentlyPlayedOptions';
import PlaylistsList from './components/PlaylistsList';
import MenuButton from './components/MenuButton';

const BACKEND_URL = 'http://127.0.0.1:3001';
const DEFAULT_LIMIT = 10;
const DEFAULT_TIME_RANGE = 'medium_term';
const DEFAULT_RECENT_LIMIT = 10;

function App() {
  const { loggedIn, logout } = useAuthStatus();
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [timeRange, setTimeRange] = useState(DEFAULT_TIME_RANGE);
  const [recentLimit, setRecentLimit] = useState(DEFAULT_RECENT_LIMIT);
  const [currentView, setCurrentView] = useState('Home');

  useEffect(() => {
    if (loggedIn === false && !isRedirecting) {
      setIsRedirecting(true);
      window.location.href = `${BACKEND_URL}/auth/login`;
    }
  }, [loggedIn, isRedirecting]);

  useEffect(() => {
    if (loggedIn) {
      fetchProfile();
    }
  }, [loggedIn]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/profile`, { 
        credentials: 'include' 
      });
      const result = await response.json();
      setProfile(result);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchData = async (endpoint, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${BACKEND_URL}/api${endpoint}${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecentlyPlayed = () => {
    fetchData('/recently-played', { limit: recentLimit });
  };

  const handleButtonClick = (title, endpoint, params) => {
    setCurrentView(title);
    fetchData(endpoint, params);
  };
  
  // Show loading state while checking auth
  if (loggedIn === null) {
    return <div>Loading...</div>;
  }

  // Don't render anything while redirecting
  if (!loggedIn || isRedirecting) {
    return null;
  }

  const renderData = () => {
    if (!data) return null;
    
    // Handle playlist data - check for items array and type
    if (data.items && Array.isArray(data.items)) {
      const firstItem = data.items[0];
      if (firstItem && firstItem.type === 'playlist') {
        return <PlaylistsList playlists={data.items} />;
      }
    }
    
    // Check if we have an array of items
    if (Array.isArray(data) && data.length > 0) {
      if (data[0].type === 'artist') {
        return <TopArtistsList artists={data} />;
      }
      if (data[0].type === 'track') {
        return <TopTracksList tracks={data} />;
      }
      if (data[0].track) {
        return <RecentlyPlayedList items={data} />;
      }
    }

    // Default JSON view for unhandled data types
    return (
      <pre style={{ 
        maxHeight: '400px', 
        overflow: 'auto', 
        backgroundColor: '#f5f5f5', 
        padding: '1rem' 
      }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  const renderOptions = () => {
    if (!data) return null;

    if (Array.isArray(data) && data.length > 0) {
      // Show FetchOptions only for top artists
      if (data[0].type === 'artist') {
        return (
          <FetchOptions 
            limit={limit} 
            timeRange={timeRange} 
            onLimitChange={setLimit} 
            onTimeRangeChange={setTimeRange} 
            onRefresh={(params) => fetchData('/top-artists', params)}
          />
        );
      }
      if (data[0].type === 'track') {
        return (
          <FetchOptions 
            limit={limit} 
            timeRange={timeRange} 
            onLimitChange={setLimit} 
            onTimeRangeChange={setTimeRange} 
            onRefresh={(params) => fetchData('/top-tracks', params)}
          />
        );
      }
      if (data[0].type === 'playlist') {
        return (
          <RecentlyPlayedOptions
            limit={limit}
            onLimitChange={setLimit}
            onRefresh={(params) => fetchData('/playlists', params)}
          />
        );
      }
      // Show RecentlyPlayedOptions only for recently played tracks
      if (data[0].track) {
        return (
          <RecentlyPlayedOptions
            limit={recentLimit}
            onLimitChange={setRecentLimit}
            onRefresh={(params) => fetchData('/recently-played', params)}
          />
        );
      }
    }
    return null;
  };

  const menuItems = [
    {
      title: '🎸 Top Artists',
      pageTitle: 'Your Top Artists',
      description: 'Discover your most played artists',
      onClick: () => handleButtonClick('Your Top Artists', '/top-artists', { limit, time_range: timeRange })
    },
    {
      title: '🎵 Top Tracks',
      pageTitle: 'Your Top Tracks',
      description: 'View your favorite songs',
      onClick: () => handleButtonClick('Your Top Tracks', '/top-tracks', { limit, time_range: timeRange })
    },
    {
      title: '⏱️ Recently Played',
      pageTitle: 'Recently Played',
      description: 'See your listening history',
      onClick: () => handleButtonClick('Recently Played', '/recently-played', { limit: recentLimit })
    },
    {
      title: '📑 Playlists',
      pageTitle: 'Your Playlists',
      description: 'Browse your playlists',
      onClick: () => handleButtonClick('Your Playlists', '/playlists', { limit: 20, offset: 0 })
    }
  ];

  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      color: '#2d2d2d'
    }}>
      <ProfileHeader profile={profile} />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
          color: '#1DB954',
          textAlign: 'center'
        }}>
          {currentView}
        </h1>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {menuItems.map(item => (
            <MenuButton
              key={item.title}
              title={item.title}
              description={item.description}
              onClick={item.onClick}
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <div style={{ 
            color: '#dc3545',
            backgroundColor: '#fff5f5',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #ffcdd2'
          }}>
            Error: {error}
          </div>
        )}

        {renderOptions()}
        {renderData()}

        <button 
          onClick={logout}
          style={{ 
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            border: '2px solid #dc3545',
            borderRadius: '20px',
            color: '#dc3545',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.9rem'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#dc3545';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#dc3545';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;