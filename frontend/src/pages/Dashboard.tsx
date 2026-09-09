import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  // const { user, logout } = useAuth();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cards = [
    {
      title: "Employees",
      count: 5,
      bg: "bg-blue-600",
      href: "/admin/employees",
    },
    {
      title: "Departments",
      count: 5,
      bg: "bg-amber-500",
      href: "/admin/departments",
    },
    { title: "Today's Check-ins", count: 0, bg: "bg-emerald-600", href: "#" },
    { title: "Yesterday's Check-ins", count: 0, bg: "bg-red-600", href: "#" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isAdmin={user?.is_admin ?? false} sidebarOpen={sidebarOpen} />

      {/* Page Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Toggle Menu
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <span>
                {user?.first_name} {user?.last_name}
              </span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                <a
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={logout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {user?.is_admin ? (
            <>
              <h1 className="text-3xl font-normal text-gray-800 mb-6">
                Admin Dashboard
              </h1>
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className={`${card.bg} text-white rounded-lg shadow-sm overflow-hidden flex flex-col justify-between`}
                  >
                    <div className="p-4 text-base font-medium">
                      {card.title}: {card.count}
                    </div>
                    <a
                      href={card.href}
                      className="px-4 py-2.5 bg-black/10 hover:bg-black/20 flex items-center justify-between text-xs text-white transition-colors"
                    >
                      <span>View Details</span>
                      <span>&rsaquo;</span>
                    </a>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full px-4">
              <h1 className="mt-4 text-3xl font-bold">
                Welcome, {user?.first_name} {user?.last_name}!
              </h1>
              <p>
                This is your employee dashboard. You can manage your attendance
                and profile from here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
