import { useState, useEffect } from 'react';

const BACKEND_URL = 'http://127.0.0.1:3001';

export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/status`, {
          credentials: 'include'
        });
        const data = await response.json();
        setLoggedIn(data.loggedIn);
      } catch (error) {
        setLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setLoggedIn(false);
      window.location.href = `${BACKEND_URL}/auth/login`;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { loggedIn, logout };
}