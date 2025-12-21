import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authAPI, User } from '@/api/api-methods';

// Ensure User interface has role (Extending the import just in case)
interface ExtendedUser extends User {
  role?: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: ExtendedUser | null;
  login: (user: ExtendedUser, token: string) => void;
  logout: () => void;
  updateAuthState: () => Promise<void>;
  isLoading: boolean; // Added loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading true

  const updateAuthState = async () => {
    setIsLoading(true);
    const token = Cookies.get('authToken'); // Get raw token from cookie

    if (!token) {
      console.log("[Auth] No token found. Resetting state.");
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    try {
      console.log("[Auth] Fetching fresh profile from Backend...");
      const res = await authAPI.getProfile();
      
      const user = res.data.user;
      console.log(`[Auth] Profile Loaded: ${user.email} | Role: ${user.role}`);

      // 1. UPDATE STATE (Source of Truth)
      setIsAuthenticated(true);
      setCurrentUser(user);

      // 2. REFRESH COOKIE (Keep it in sync)
      Cookies.set('userData', JSON.stringify(user), { expires: 7 });

    } catch (err) {
      console.error("[Auth] Failed to fetch profile:", err);
      
      // If the token is invalid (401), force logout. Do NOT fallback to stale cookies.
      // This prevents "undefined" role issues from persisting.
      logout(); 
    } finally {
      setIsLoading(false);
    }
  };

  const login = (user: ExtendedUser, token: string) => {
    console.log("[Auth] Login called. Setting cookies.");
    // Store token and user data in cookies
    Cookies.set('authToken', token, { expires: 7 }); 
    Cookies.set('userData', JSON.stringify(user), { expires: 7 });
    
    setIsAuthenticated(true);
    setCurrentUser(user);
    
    // Optional: Fetch fresh immediately to be safe
    // updateAuthState(); 
  };

  const logout = () => {
    console.log("[Auth] Logging out...");
    // Clear all cookies
    Cookies.remove('authToken');
    Cookies.remove('userData');
    
    // Reset State
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    updateAuthState();
    
    // Listen for storage events (multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      // If the cookie changed in another tab, update here
      updateAuthState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    updateAuthState,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};