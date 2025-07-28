import { useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function useRepos() {
  return useCallback(async (username: string) => {
    const response = await axios.get(`${BASE_URL}/repo/${username}`, {
      withCredentials: true,
    });
    return response.data;
  }, []);
}
