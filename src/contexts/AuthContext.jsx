import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("User loaded from localStorage:", parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);

      const userData = response.data;

      if (!userData || !userData.role) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("userNum", userData.userNum);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Login successful, stored in localStorage:", {
        userNum: userData.userNum,
        role: userData.role
      });

      setUser(userData);

      // Navigate based on role - matching routes from App.jsx
      if (userData.role === "EMPLOYEE") {
        navigate("/employee");
      } else if (userData.role === "OFFICER") {
        navigate("/officer");
      } else if (userData.role === "ADMIN") {
        navigate("/admin");
      }

      return {
        success: true,
        data: userData
      };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("userNum");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("assignedGrievances");

      console.log("Logged out, localStorage cleared");

      setUser(null);
      navigate("/login");
    }
  };

  const register = async (userData, role) => {
    try {
      await api.post(`/auth/register/${role.toLowerCase()}`, userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};