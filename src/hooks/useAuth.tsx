
// Supabase auth has been removed. This is now a dummy file for compatibility.

import React, { createContext, useContext } from "react";

type AuthContextType = {
  user: null;
  session: null;
  loading: false;
  signUp: () => Promise<{ error?: string }>;
  signIn: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  signUp: async () => ({ error: "Authentication disabled" }),
  signIn: async () => ({ error: "Authentication disabled" }),
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider
    value={{
      user: null,
      session: null,
      loading: false,
      signUp: async () => ({ error: "Authentication disabled" }),
      signIn: async () => ({ error: "Authentication disabled" }),
      signOut: async () => {},
    }}
  >
    {children}
  </AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);

