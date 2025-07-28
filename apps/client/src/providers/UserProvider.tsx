import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import type { User } from './UserContext';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${BASE_URL}/auth/refresh`, { withCredentials: true });
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}; 