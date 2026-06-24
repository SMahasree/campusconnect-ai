import React, { createContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../api/client';

export const AuthContext = createContext(null);

// Context API provides auth state and actions to the whole app tree.
export default function AuthProvider({ children }) {
  // useState stores reactive state inside function components.
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  // Loading helps avoid UI flicker while token is being read and headers set.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // useEffect runs after render; here it syncs token → axios headers.
    if (token) setAuthToken(token);
    else setAuthToken(null);

    setLoading(false);
  }, [token]);

  const value = useMemo(() => {
    return {
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login: async ({ email, password }) => {
        const res = await api.post('/auth/login', { email, password });
        const nextToken = res.data.token;
        const nextUser = res.data.user;

        localStorage.setItem('token', nextToken);
        localStorage.setItem('user', JSON.stringify(nextUser));

        setToken(nextToken);
        setUser(nextUser);
        setAuthToken(nextToken);

        return res.data;
      },
      register: async ({ name, email, password }) => {
        const res = await api.post('/auth/register', { name, email, password });
        return res.data;
      },
      googleLogin: async ({ token }) => {
        const res = await api.post('/auth/google-login', { token });
        const nextToken = res.data.token;
        const nextUser = res.data.user;

        localStorage.setItem('token', nextToken);
        localStorage.setItem('user', JSON.stringify(nextUser));

        setToken(nextToken);
        setUser(nextUser);
        setAuthToken(nextToken);

        return res.data;
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setAuthToken(null);
      }
    };
  }, [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

