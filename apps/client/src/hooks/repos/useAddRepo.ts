import { useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function useAddRepo() {
  return useCallback(async (data: any) => {
    const response = await axios.post(`${BASE_URL}/repo/create`, data, {
      withCredentials: true,
    });
    return response.data;
  }, []);
}
