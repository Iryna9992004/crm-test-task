import { createContext } from 'react';

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