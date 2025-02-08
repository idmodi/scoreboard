
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'adminfar') {
      setIsAuthenticated(true);
      setIsAdmin(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      toast({
        title: "Welcome back, admin!",
        description: "You now have full access to all features.",
      });
      navigate('/players');
    } else {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Invalid credentials. Please try again.",
      });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate('/login');
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAuthenticated(isAuth);
    setIsAdmin(adminStatus);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
