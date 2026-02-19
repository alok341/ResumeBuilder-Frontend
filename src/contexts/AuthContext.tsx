import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AuthResponse } from "@/types/resume";
import { apiGetProfile } from "@/lib/api";

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (user: AuthResponse) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    
    try {
      const profile = await apiGetProfile();
      // Backend getProfile() returns AuthResponse without token
      // So we need to add the token back
      setUser({ ...profile, token });
    } catch {
      logout();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      refreshProfile()
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token, refreshProfile]);

  const login = (authResponse: AuthResponse) => {
    localStorage.setItem("token", authResponse.token);
    setToken(authResponse.token);
    setUser(authResponse);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};