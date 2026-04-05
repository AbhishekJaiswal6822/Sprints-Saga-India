// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\AuthProvider.jsx - FINAL RBAC-READY VERSION

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api";

// 1. Create the Auth Context
const AuthContext = createContext({
  user: { isLoggedIn: false, role: null },
  token: null,
  loading: true,
  login: () => { },
  // ... other functions
});

// 2. Custom Hook
export const useAuth = () => useContext(AuthContext);

// 3. Auth Provider Component
export function AuthProvider({ children }) {
  // State to hold full user object including role and login status
  const [user, setUser] = useState({ isLoggedIn: false, role: null });
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  

  // Load initial state from storage and set loading state
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          isLoggedIn: true,
          role: parsedUser.role || 'user',
        });
        setToken(storedToken);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Effect: Sync token state to localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Effect: Sync user state to localStorage (only store if logged in)
  useEffect(() => {
    if (user.isLoggedIn) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);


  // Authentication API Calls
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api("/api/auth/signin", { method: "POST", body: { email, password } });

      if (data.token && data.user) {
        setToken(data.token);
        setUser({
          ...data.user,
          isLoggedIn: true,
          role: data.user.role || 'user',
        });
        return { success: true, user: data.user };
      }
      return {
        success: false,
        message: data.message || "Login failed",
        errorCode: data.errorCode || null
      };

    } catch (error) {
      return { success: false, message: error.message || 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const data = await api("/api/auth/register", { method: "POST", body: { name, email, password, phone } });

      if (data.token && data.user) {
        setToken(data.token);
        setUser({
          ...data.user,
          isLoggedIn: true,
          role: data.user.role || 'user',
        });
        return { success: true, user: data.user };
      }
      throw new Error(data.message || 'Registration failed');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser({ isLoggedIn: false, role: null });
    setLoading(false);
  };

  const fetchMe = async () => {
    if (!token) return null;
    const data = await api("/api/auth/me", { token });
    if (data.user) {
      setUser({
        ...data.user,
        isLoggedIn: true,
        role: data.user.role || 'user',
      });
      return data.user;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register: registerUser,
        logout,
        fetchMe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}