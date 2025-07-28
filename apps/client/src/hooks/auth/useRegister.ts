import { useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface RegisterData {
  email: string;
  password: string;
  username: string;
  githubKey: string;
}

export function useRegister() {
  return useCallback(async (data: RegisterData) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  }, []);
}
