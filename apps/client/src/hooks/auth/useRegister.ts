import { useCallback } from 'react';

interface RegisterData {
  email: string;
  password: string;
}

export function useRegister() {
  return useCallback(async (data: RegisterData) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  }, []);
}
