import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
// import { Navigate } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  // token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean | null;
  // error: string | null; // Added to track server errors
  login: (email: string, password: string) => Promise<void>; // Accepts credentials now
  register: (
    first_name: string,
    last_name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthenticated(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Token refresh failed";
      setError(errorMessage);
      setIsAuthenticated(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (!tokenExpiration) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthenticated(true);
    }
    // const response = await api.get("/api/user/me/", {headers: {Authorization: `Bearer ${token}`, },});
    const response = await api.get("/api/user/me/");
      setUser(response.data);
  };

  const register = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string,
  ) => {
    try {
      await api.post("/api/user/register/", {
        first_name,
        last_name,
        email,
        password,
      });
    } catch (err: any) {
      // Capture errors sent by DRF
      const errorMessage =
        err.response?.data?.detail || "Registration Failed.";
      setError(errorMessage);
      throw new Error(errorMessage); // Pass error down to the form component
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/token/", { email, password });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      await auth();
      // setIsAuthenticated(true);
    } catch (err: any) {
      // Capture errors sent by DRF
      const errorMessage =
        err.response?.data?.detail || "Invalid login credentials";
      setError(errorMessage);
      throw new Error(errorMessage); // Pass error down to the form component
    }
  };

  const logout = () => {
    debugger;
    localStorage.clear();
    // localStorage.removeItem("access_token");
    // localStorage.removeItem("refresh_token");
    // setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
