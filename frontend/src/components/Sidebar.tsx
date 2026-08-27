
const Sidebar = ({ isAdmin, sidebarOpen }: {isAdmin: boolean, sidebarOpen: boolean}) => {
  const navItemsAdmin = [
    { label: 'Dashboard', href: '/admin/dashboard', active: true },
    { label: 'Departments', href: '/admin/departments' },
    { label: 'Employees', href: '/admin/employees' },
    { label: 'Reports', href: '/admin/reports' },
    { label: 'Profile', href: '/admin/profile' },
    { label: 'Logout', href: '/logout' },
  ];

    const navItemsEmployee = [
    { label: 'Dashboard', href: '/admin/dashboard', active: true },
    { label: 'Profile', href: '/admin/departments' },
    { label: 'Mark Attendance', href: '/admin/employees' },
    { label: 'Current Month Attendance', href: '/admin/reports' },
    { label: 'Reports', href: '/admin/profile' },
  ];

  return (
    <>
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
        } transition-all duration-300 ease-in-out border-r border-gray-200 bg-white overflow-hidden flex-shrink-0`}
      >
        <div className="p-4 text-lg font-semibold border-b border-gray-200 bg-gray-50">
          {isAdmin ? "Admin Panel" : "Employee Panel" }
        </div>
        <nav className="divide-y divide-gray-100">
          {(isAdmin ? navItemsAdmin : navItemsEmployee).map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                item.active ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

