// hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally verify token with an API call
      setIsAuthenticated(true);
    }
  }, []);

  return { isAuthenticated };
};
