import { useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function useEditRepo() {
  return useCallback(async (projectOwner: string, name: string, data: any) => {
    const response = await axios.put(`${BASE_URL}/repo/update/${projectOwner}/${name}`, data, {
      withCredentials: true,
    });
    return response.data;
  }, []);
}
