import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        {/* Navbar Component */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
                    <Link
                      to={card.href}
                      className="px-4 py-2.5 bg-black/10 hover:bg-black/20 flex items-center justify-between text-xs text-white transition-colors"
                    >
                      <span>View Details</span>
                      <span>&rsaquo;</span>
                    </Link>
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
