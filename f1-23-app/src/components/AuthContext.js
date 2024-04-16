import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, userId: null });

  const logIn = (token, userId) => {
    setAuth({ token, userId });
  };

  const logOut = () => {
    setAuth({ token: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};