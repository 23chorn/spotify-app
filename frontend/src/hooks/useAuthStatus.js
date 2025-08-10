import { useState, useEffect } from 'react';

const BACKEND_URL = 'http://127.0.0.1:3001';

export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/auth/status`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setLoggedIn(data.loggedIn))
      .catch(() => setLoggedIn(false));
  }, []);

  const logout = () => {
    return fetch(`${BACKEND_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
      .then(() => setLoggedIn(false));
  };

  return { loggedIn, logout };
}