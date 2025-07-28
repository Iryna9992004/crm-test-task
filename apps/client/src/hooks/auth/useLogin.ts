import { useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface LoginData {
  email: string;
  password: string;
}

export function useLogin() {
  return useCallback(async (data: LoginData) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  }, []);
}
