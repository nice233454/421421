import { useState, useEffect } from 'react';

const ADMIN_SESSION_KEY = 'artist_admin_session';
const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD = 'ArtistAdmin#2024';

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  function login(username: string, password: string): boolean {
    if (username === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  }

  return { isAuthenticated, login, logout };
}
