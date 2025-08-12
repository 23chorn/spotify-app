import React from 'react';

const TopArtistsList = ({ artists }) => {
  if (!artists) return null;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '2rem',
      padding: '1rem'
    }}>
      {artists.map((artist) => (
        <div 
          key={artist.id}
          style={{
            backgroundColor: '#282828',
            borderRadius: '8px',
            padding: '1rem',
            color: 'white'
          }}
        >
          <img 
            src={artist.images[0]?.url} 
            alt={artist.name}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}
          />
          <h3 style={{ margin: '0 0 0.5rem 0' }}>{artist.name}</h3>
          <div style={{ 
            backgroundColor: '#1DB954', 
            display: 'inline-block',
            padding: '0.25rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            marginBottom: '0.5rem'
          }}>
            Popularity: {artist.popularity}
          </div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            <strong>Genres:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
              {artist.genres.map((genre) => (
                <span 
                  key={genre}
                  style={{
                    backgroundColor: '#404040',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem'
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <a 
            href={artist.uri}
            style={{
              color: '#1DB954',
              textDecoration: 'none',
              fontSize: '0.9rem',
              marginTop: '1rem',
              display: 'inline-block'
            }}
          >
            Open in Spotify
          </a>
        </div>
      ))}
    </div>
  );
};

export default TopArtistsList;