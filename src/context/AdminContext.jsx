import React, { createContext, useState, useEffect, useContext } from "react";
import Api from "../services/Api";

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const storedToken = localStorage.getItem("adminToken");
    

    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin));
      setToken(storedToken);
    } 
    // else {
    //   // default admin for now
    //   const defaultAdmin = { username: "admin", role: "admin" };
    //   const defaultToken = "default-token";

    //   setAdmin(defaultAdmin);
    //   setToken(defaultToken);

    //   localStorage.setItem("admin", JSON.stringify(defaultAdmin));
    //   localStorage.setItem("adminToken", defaultToken);
    // }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const loginData = { email: email.trim(), password };
      const res = await Api.loginAccountAPI(loginData);

      const adminData = res.data?.admin || res.data?.user || res.user;
      const tokenData = res.data?.token || res.token;

      if (!adminData || !tokenData) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("admin", JSON.stringify(adminData));
      localStorage.setItem("authToken", tokenData);
    } catch (error) {
      console.error("Admin login error:", error?.response?.data || error.message || error);
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
  };

  return (
    <AdminContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

// hook for convenience
export const useAdmin = () => useContext(AdminContext);