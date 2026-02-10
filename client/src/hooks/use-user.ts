import { useState, useEffect } from 'react';

export function useUser() {
  const [user, setUser] = useState<{ name: string; email: string; role?: 'student' | 'trainer' } | null>(() => {
    const saved = localStorage.getItem('mock_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('mock_user');
      setUser(saved ? JSON.parse(saved) : null);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('mock-login', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('mock-login', handleStorage);
    };
  }, []);

  const login = (name: string, email: string, role: 'student' | 'trainer' = 'student') => {
    const userData = { name, email, role };
    localStorage.setItem('mock_user', JSON.stringify(userData));
    window.dispatchEvent(new Event('mock-login'));
  };

  const logout = () => {
    localStorage.removeItem('mock_user');
    window.dispatchEvent(new Event('mock-login'));
  };

  return { user, login, logout };
}
