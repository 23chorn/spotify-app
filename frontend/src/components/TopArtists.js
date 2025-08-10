import React from 'react';

export default function TopArtists({ artists }) {
  if (!artists || artists.length === 0) return null;

  return (
    <ul style={{ textAlign: 'left', marginTop: '10px' }}>
      {artists.map(artist => (
        <li key={artist.id}>
          <strong>{artist.name}</strong> (Genres: {artist.genres.join(', ')})
        </li>
      ))}
    </ul>
  );
}