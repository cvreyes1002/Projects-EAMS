import { Link, useLocation } from "react-router-dom";
import { useAuth } from './AuthContext';

const Sidebar = ({ isAdmin, sidebarOpen }: {isAdmin: boolean, sidebarOpen: boolean}) => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItemsAdmin = [
    { label: 'Dashboard', href: '/admin/dashboard', active: true },
    { label: 'Departments', href: '/admin/departments' },
    { label: 'Employees', href: '/admin/employees' },
    { label: 'Reports', href: '/admin/reports' },
    { label: 'Profile', href: '/admin/profile' },
    { label: 'Logout', href: '#' },
  ];

    const navItemsEmployee = [
    { label: 'Dashboard', href: '/', active: true },
    { label: 'Profile', href: '/employee/profile' },
    { label: 'Mark Attendance', href: '/employee/mark-attendance' },
    { label: 'Current Month Attendance', href: '/employee/current-month-attendance' },
    { label: 'Reports', href: '/employee/reports' },
    { label: 'Change Password', href: '/employee/change-password' },
    { label: 'Logout', href: '#' },
  ];

  return (
    <>
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
        } transition-all duration-300 ease-in-out border-r border-gray-200 bg-white overflow-hidden flex-shrink-0`}
      >
        <div className="p-4 text-lg font-semibold border-b border-gray-200 bg-gray-50">
          {isAdmin ? "Admin Panel" : "Employee Panel"}
        </div>
        <nav className="divide-y divide-gray-100">
          {(isAdmin ? navItemsAdmin : navItemsEmployee).map((item, index) => {
            const isLogout = item.label === 'Logout';

            // Check if the current route matches the item's href (ignoring Logout)
            const isActive = !isLogout && location.pathname === item.href;

            const itemClasses = `block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
              isActive ? 'bg-gray-100 font-medium text-blue-600' : ''
            }`;

            if (isLogout) {
              return (
                <button
                  key={index}
                  onClick={logout}
                  className={itemClasses}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={index}
                to={item.href}
                className={itemClasses}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;