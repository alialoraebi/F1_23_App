// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null
  });

  const isLoggedIn = !!auth.token;

  const logIn = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setAuth({ token, userId });
    console.log(`User with ID ${userId} logged in with token ${token}`); 
  };

  const logOut = (userId) => {
    console.log(`User with ID ${auth.userId} logged out`); 
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setAuth({ token: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};