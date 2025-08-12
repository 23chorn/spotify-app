import React from 'react';

const TopTracksList = ({ tracks }) => {
  if (!tracks) return null;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {tracks.map((track) => (
        <div 
          key={track.uri}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#282828',
            borderRadius: '8px',
            color: 'white'
          }}
        >
          <img 
            src={track.album.images[1]?.url} 
            alt={track.album.name}
            style={{
              width: '64px',
              height: '64px',
              marginRight: '1rem',
              borderRadius: '4px'
            }}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{track.name}</h3>
            <div style={{ fontSize: '0.9rem', color: '#b3b3b3' }}>
              {track.artists.map(artist => artist.name).join(', ')}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b3b3b3', marginTop: '0.25rem' }}>
              {track.album.name}
            </div>
          </div>
          <a 
            href={track.uri}
            style={{
              color: '#1DB954',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #1DB954',
              fontSize: '0.8rem'
            }}
          >
            Play on Spotify
          </a>
        </div>
      ))}
    </div>
  );
};

export default TopTracksList;