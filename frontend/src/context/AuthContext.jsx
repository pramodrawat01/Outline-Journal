import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the backend if we're already logged in (cookie-based)
  useEffect(() => {
    axiosInstance
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signup = async (formData) => {
    const res = await axiosInstance.post("/auth/signup", formData);
    setUser(res.data.user);
  };

  const login = async (formData) => {
    const res = await axiosInstance.post("/auth/login", formData);
    setUser(res.data.user);
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}