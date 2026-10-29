import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { PublicRoute, ProtectedRoute } from "./components/Guards";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import Departments from "./pages/Departments";
import MarkAttendance from "./pages/MarkAttendance";
import CurrentMonthAttendance from "./pages/CurrentMonthAttendance";
import EmployeeProfile from "./pages/EmployeeProfile";
import AdminProfile from "./pages/AdminProfile";

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Unauthenticated-only routes (e.g., /login redirects to "/" if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/logout" element={<Logout />} /> */}
          </Route>

          {/* Authenticated-only routes */}
          <Route element={<ProtectedRoute />}>
            {/* Common Pages */}
            <Route path="/" element={<Dashboard />} />

            {/* Admin Pages */}
            <Route path="/admin/employees" element={<EmployeeList />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/profile" element={<AdminProfile />} />

            {/* Employee Pages */}
            <Route path="/employee/profile" element={<EmployeeProfile />} />
            <Route path="/employee/mark-attendance" element={<MarkAttendance />} />
            <Route path="/employee/current-month-attendance" element={<CurrentMonthAttendance />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
