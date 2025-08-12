import React from 'react';

const RecentlyPlayedList = ({ items }) => {
  if (!items) return null;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {items.map((item) => (
        <div 
          key={`${item.track.id}-${item.played_at}`}
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
            src={item.track.album.images[2]?.url} 
            alt={item.track.name}
            style={{
              width: '48px',
              height: '48px',
              marginRight: '1rem',
              borderRadius: '4px'
            }}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 0.25rem 0' }}>{item.track.name}</h3>
            <div style={{ fontSize: '0.9rem', color: '#b3b3b3' }}>
              {item.track.artists.map(artist => artist.name).join(', ')}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#1DB954',
              marginTop: '0.25rem' 
            }}>
              Played: {new Date(item.played_at).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentlyPlayedList;