"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { shouldSkipAuthInBuild, mockUser, SESSION_CONFIG } from "@/lib/deployment-config";

type User = {
  id: string;
  name: string;
  email: string;
  favorites?: number[]; // Add favorites to user data
};

type Session = {
  user: User;
  token: string;
  expiresAt: number; // Timestamp when session expires
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requireAuth: (redirectTo?: string) => Promise<boolean>;
  updateUserData: (userData: Partial<User>) => Promise<boolean>;
  updateFavorites: (favorites: number[]) => Promise<boolean>; // Add function to update favorites
}

// Create a default context value for static rendering
const defaultContextValue: AuthContextType = {
  user: mockUser,
  isLoading: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  requireAuth: async () => true,
  updateUserData: async () => false,
  updateFavorites: async () => false, // Add default implementation
};

const AuthContext = createContext<AuthContextType | undefined>(
  shouldSkipAuthInBuild ? defaultContextValue : undefined
);

// Helper functions for session management
const storeSession = (session: Session) => {
  localStorage.setItem(SESSION_CONFIG.storageKey, JSON.stringify(session));
};

const getStoredSession = (): Session | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_CONFIG.storageKey);
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData) as Session;
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_CONFIG.storageKey);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error("Error loading session:", error);
    localStorage.removeItem(SESSION_CONFIG.storageKey);
    return null;
  }
};

// Helper function to retrieve stored favorites for a user ID
const getStoredFavorites = (userId: string): number[] => {
  try {
    const storedFavorites = localStorage.getItem(`favorites-${userId}`);
    if (storedFavorites) {
      return JSON.parse(storedFavorites);
    }
  } catch (error) {
    console.error("Error loading favorites:", error);
  }
  return [];
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(!shouldSkipAuthInBuild);
  const router = useRouter();

  // Skip auth initialization during static build
  useEffect(() => {
    if (shouldSkipAuthInBuild) return;
    
    // Check if session is stored in localStorage on initial load
    const loadSession = () => {
      try {
        const session = getStoredSession();
        if (session) {
          // Load user's favorites if they exist
          const favorites = getStoredFavorites(session.user.id);
          
          // Set user with favorites
          const userWithFavorites = {
            ...session.user,
            favorites
          };
          
          setUser(userWithFavorites);
          
          // Refresh session expiration time
          const refreshedSession = {
            ...session,
            user: userWithFavorites,
            expiresAt: Date.now() + SESSION_CONFIG.duration
          };
          storeSession(refreshedSession);
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        // Clear potentially corrupted data
        localStorage.removeItem(SESSION_CONFIG.storageKey);
      } finally {
        setIsLoading(false);
      }
    };

    // Only run in browser environment
    if (typeof window !== "undefined") {
      loadSession();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a user ID based on email for consistency between logins
      const userId = `user-${email.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
      
      // Load any previously stored favorites for this user
      const favorites = getStoredFavorites(userId);
      
      // Create a mock user (in a real app, this would come from your API)
      const newUser: User = {
        id: userId,
        name: email.split('@')[0],
        email,
        favorites
      };
      
      // Create a session with expiration
      const session: Session = {
        user: newUser,
        token: 'mock-token-' + Math.random().toString(36).substring(2, 15),
        expiresAt: Date.now() + SESSION_CONFIG.duration
      };
      
      // Store the session in localStorage
      storeSession(session);
      setUser(newUser);
      
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
      
      if (!name || !email || !password) {
        throw new Error("Name, email and password are required");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a user ID based on email for consistency
      const userId = `user-${email.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
      
      // Create a new user with empty favorites
      const newUser: User = {
        id: userId,
        name,
        email,
        favorites: []
      };
      
      // Create a session with expiration
      const session: Session = {
        user: newUser,
        token: 'mock-token-' + Math.random().toString(36).substring(2, 15),
        expiresAt: Date.now() + SESSION_CONFIG.duration
      };
      
      // Store the session in localStorage
      storeSession(session);
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserData = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const currentSession = getStoredSession();
      if (!currentSession || !user) return false;
      
      // Update user data
      const updatedUser = { ...user, ...userData };
      
      // Update session with new user data
      const updatedSession: Session = {
        ...currentSession,
        user: updatedUser,
        expiresAt: Date.now() + SESSION_CONFIG.duration // Refresh expiration
      };
      
      // Save updated session
      storeSession(updatedSession);
      setUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error("Error updating user data:", error);
      return false;
    }
  };
  
  // New function to update user's favorites
  const updateFavorites = async (favorites: number[]): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Get current session
      const currentSession = getStoredSession();
      if (!currentSession) return false;
      
      // Update user with new favorites
      const updatedUser = { 
        ...user, 
        favorites 
      };
      
      // Update session
      const updatedSession: Session = {
        ...currentSession,
        user: updatedUser,
        expiresAt: Date.now() + SESSION_CONFIG.duration // Refresh expiration
      };
      
      // Save to localStorage
      storeSession(updatedSession);
      
      // Also save to favorites-specific storage for backward compatibility
      localStorage.setItem(`favorites-${user.id}`, JSON.stringify(favorites));
      
      // Update local state
      setUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error("Error updating favorites:", error);
      return false;
    }
  };

  const logout = () => {
    // Don't remove favorites from localStorage when logging out
    // so they can be retrieved on next login
    localStorage.removeItem(SESSION_CONFIG.storageKey);
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

    // Check if session is valid
    const session = getStoredSession();
    if (!session || !user) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    
    return true;
  };

  // Use static mock values during build
  const contextValue: AuthContextType = shouldSkipAuthInBuild 
    ? defaultContextValue
    : {
        user,
        isLoading,
        login,
        register,
        logout,
        requireAuth,
        updateUserData,
        updateFavorites,
      };

  return (
    <AuthContext.Provider value={contextValue}>
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