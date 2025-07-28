import { useCallback } from 'react';

interface LoginData {
  email: string;
  password: string;
}

export function useLogin() {
  return useCallback(async (data: LoginData) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  }, []);
}
