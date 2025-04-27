import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthDataContext = createContext();

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/auth/user', { withCredentials: true })
      .then(response => {
        setUser(response.data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  return (
    <AuthDataContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthDataContext.Provider>
  );
};
