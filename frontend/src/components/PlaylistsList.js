import React from 'react';

const PlaylistsList = ({ playlists }) => {
  if (!playlists || !Array.isArray(playlists) || playlists.length === 0) {
    return <div>No playlists found</div>;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '2rem',
      padding: '1rem'
    }}>
      {playlists.map((playlist) => {
        // Safely access nested properties
        const imageUrl = playlist?.images?.[0]?.url;
        const trackCount = playlist?.tracks?.total || 0;
        const ownerName = playlist?.owner?.display_name || 'Unknown';

        return (
          <div
            key={playlist.id}
            style={{
              backgroundColor: '#282828',
              borderRadius: '8px',
              padding: '1rem',
              color: 'white',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={playlist.name}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '1rem'
                }}
              />
            )}
            <h3 style={{ 
              margin: '0 0 0.5rem 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {playlist.name}
            </h3>
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#b3b3b3',
              marginBottom: '0.5rem' 
            }}>
              By {ownerName}
            </div>
            <div style={{ 
              backgroundColor: '#1DB954',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              display: 'inline-block',
              marginBottom: 'auto'
            }}>
              {trackCount} tracks
            </div>
            {playlist.uri && (
              <a
                href={playlist.uri}
                style={{
                  color: '#1DB954',
                  textDecoration: 'none',
                  padding: '0.5rem',
                  border: '1px solid #1DB954',
                  borderRadius: '4px',
                  textAlign: 'center',
                  marginTop: '1rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1DB95420'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Open in Spotify
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistsList;