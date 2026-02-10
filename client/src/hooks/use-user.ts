import { useState, useEffect } from 'react';

export function useUser() {
  const [user, setUser] = useState<{ name: string; email: string; role?: 'student' | 'trainer' } | null>(() => {
    const saved = localStorage.getItem('mock_user');
    if (!saved) return null;
    
    const parsed = JSON.parse(saved);
    
    // Auto-fix role if missing or incorrect for known trainers
    const trainerEmails = [
      "jorge.catiempo@cirrusrecruitment.com",
      "susan.centino@cirrusrecruitment.com",
      "jobart.benedito@cirrusrecruitment.com"
    ];
    
    if (parsed && trainerEmails.includes(parsed.email.toLowerCase().trim())) {
      parsed.role = 'trainer';
    }
    
    return parsed;
  });

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('mock_user');
      if (!saved) {
        setUser(null);
        return;
      }

      const parsed = JSON.parse(saved);
      
      // Auto-fix role here too
      const trainerEmails = [
        "jorge.catiempo@cirrusrecruitment.com",
        "susan.centino@cirrusrecruitment.com",
        "jobart.benedito@cirrusrecruitment.com"
      ];
      
      if (parsed && trainerEmails.includes(parsed.email.toLowerCase().trim())) {
        parsed.role = 'trainer';
      }

      setUser(parsed);
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
