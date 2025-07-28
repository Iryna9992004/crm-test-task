import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface User {
  username: string;
  email: string;
  githubKey: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${BASE_URL}/auth/refresh`, { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
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