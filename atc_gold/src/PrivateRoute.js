// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth'; // Custom hook to check authentication

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth(); // Hook to check authentication status

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
