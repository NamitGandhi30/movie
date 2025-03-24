"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requireAuth: (redirectTo?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    // Only run in browser environment
    if (typeof window !== "undefined") {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll simulate an API call
      // In a real app, you would make a request to your authentication API
      
      // Simple validation for demo
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a mock user (in a real app, this would come from your API)
      const mockUser: User = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email
      };
      
      // Store the user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll simulate an API call
      // In a real app, you would make a request to your registration API
      
      // Simple validation for demo
      if (!name || !email || !password) {
        throw new Error("Name, email and password are required");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new user
      const newUser: User = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name,
        email
      };
      
      // Store the user in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  // Function to check if user is authenticated and redirect if not
  const requireAuth = async (redirectTo = "/login") => {
    // Wait for initial auth check to complete
    if (isLoading) {
      await new Promise(resolve => {
        const checkLoading = () => {
          if (!isLoading) {
            resolve(true);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    if (!user) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 