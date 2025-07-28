import { useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function useDeleteRepo() {
  return useCallback(async (projectOwner: string, name: string) => {
    const response = await axios.delete(`${BASE_URL}/repo/${projectOwner}/${name}`, {
      withCredentials: true,
    });
    return response.data;
  }, []);
}
