"use client";

import { createContext, useCallback, useEffect, useState } from "react";

import { getProfile } from "@/services/auth";
import { post } from "@/services/axios";
import type { AuthContextValue, AdminProfile } from "@/types/auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await post("/auth/logout");
    } catch {
      // cookie cleared server-side, proceed regardless
    }
    setAdmin(null);
  }, []);

  useEffect(() => {
    getProfile()
      .then((res) => setAdmin(res.data))
      .catch(() => setAdmin(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        setAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
