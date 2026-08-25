import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { AuthProvider } from "./components/AuthContext";
import Login from "./pages/Login";
import { PublicRoute, ProtectedRoute } from "./components/Guards";

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Unauthenticated-only routes (e.g., /login redirects to "/" if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Route>

          {/* Authenticated-only routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
