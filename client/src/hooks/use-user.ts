import { useState, useEffect } from 'react';

export function useUser() {
  const [user, setUser] = useState<{ name: string; email: string; role?: 'student' | 'trainer'; plan?: 'free' | 'pro' | 'trade'; sessionId?: string } | null>(() => {
    const saved = sessionStorage.getItem('mock_user_session');
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
      const saved = sessionStorage.getItem('mock_user_session');
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
    const sessionId = Math.random().toString(36).substring(2, 15);
    const userData = { name, email, role, plan, sessionId };
    sessionStorage.setItem('mock_user_session', JSON.stringify(userData));
    window.dispatchEvent(new Event('mock-login'));
  };
  
  const updatePlan = (plan: 'free' | 'pro' | 'trade') => {
    const saved = sessionStorage.getItem('mock_user_session');
    let userData = saved ? JSON.parse(saved) : { name: 'Guest', email: 'guest@example.com', role: 'student', sessionId: Math.random().toString(36).substring(2, 15) };
    
    userData.plan = plan;
    sessionStorage.setItem('mock_user_session', JSON.stringify(userData));
    
    // Update local state immediately as well
    setUser(userData);
    window.dispatchEvent(new Event('mock-login'));
  };

  const logout = () => {
    sessionStorage.removeItem('mock_user_session');
    window.dispatchEvent(new Event('mock-login'));
  };

  return { user, login, logout, updatePlan };
}
