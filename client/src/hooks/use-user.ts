import { useState, useEffect } from 'react';

export function useUser() {
  const [user, setUser] = useState<{ name: string; email: string; role?: 'student' | 'trainer'; plan?: 'free' | 'pro' | 'trade' } | null>(() => {
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
      parsed.plan = 'pro'; // Trainers get pro access
    }
    
    // Default to free plan if not specified
    if (parsed && !parsed.plan) {
      parsed.plan = 'free';
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
        parsed.plan = 'pro';
      }

      if (parsed && !parsed.plan) {
        parsed.plan = 'free';
      }

      setUser(parsed);
    };

    window.addEventListener('storage', handleStorage);
    window.dispatchEvent(new Event('mock-login')); // Trigger immediately on mount too if needed
    window.addEventListener('mock-login', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('mock-login', handleStorage);
    };
  }, []);

  const login = (name: string, email: string, role: 'student' | 'trainer' = 'student', plan: 'free' | 'pro' | 'trade' = 'free') => {
    const userData = { name, email, role, plan };
    localStorage.setItem('mock_user', JSON.stringify(userData));
    window.dispatchEvent(new Event('mock-login'));
  };
  
  const updatePlan = (plan: 'free' | 'pro' | 'trade') => {
    if (!user) return;
    const userData = { ...user, plan };
    localStorage.setItem('mock_user', JSON.stringify(userData));
    window.dispatchEvent(new Event('mock-login'));
  };

  const logout = () => {
    localStorage.removeItem('mock_user');
    window.dispatchEvent(new Event('mock-login'));
  };

  return { user, login, logout, updatePlan };
}
