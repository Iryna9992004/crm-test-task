import { useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface RegisterData {
  email: string;
  password: string;
  username: string;
  githubKey: string;
}

export function useRegister() {
  const navigate = useNavigate();
  
  return useCallback(async (data: RegisterData) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    navigate('/repos')
    return response.data;
  }, []);
}
