import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const PublicRoute = () => {
  const { isAuthenticated, isLoading} = useAuth();

  if (isLoading) return <div>Loading...</div>  // Prevents UI flash during token check

  // Directs authenticated users back to home
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
