import React from 'react';

export default function AuthStatus({ loggedIn, backendUrl }) {
  if (loggedIn === null) return <p>Loading...</p>;

  if (!loggedIn) {
    return (
      <div>
        <h2>You are not logged in.</h2>
        <a href={`${backendUrl}/auth/login`}>
          <button>Login with Spotify</button>
        </a>
      </div>
    );
  }

  return null;
}