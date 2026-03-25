import { useState, useEffect, useContext, createContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Create Auth Context
 */
export const AuthContext = createContext(null);

/**
 * Custom Hook to consume Auth Context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (location.pathname.includes('admin') && !loading && user?.role != 'admin') {
      navigate('/')
    }
  }, [location, loading]);

  const normalizeRole = (r) =>
    (r || "user").toString().trim().toLowerCase();

  /**
   * Verify authentication status
   */
  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/verify", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const role = normalizeRole(data?.user?.role);
        setUser({ ...data.user, role });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login
   */
  const login = async (credentials) => {
    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        const role = normalizeRole(data?.user?.role);
        setUser({ ...data.user, role });
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  /**
   * Register
   */
  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        const role = normalizeRole(data?.user?.role);
        setUser({ ...data.user, role });
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      return { success: false, error: "Register failed" };
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
    }
    window.location.href = "http://localhost:5173/";
  };

  /**
   * Context Value
   */
  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    refreshAuth: checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};