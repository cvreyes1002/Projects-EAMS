import { useState } from 'react';

const Departments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: 'Human Resources',
      description: 'Manages employee relations and company policies',
    },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState({ id: null, name: '', description: '' });

  // Open modal for Add or Edit
  const handleOpenModal = (dept = { id: null, name: '', description: '' }) => {
    setCurrentDept(dept);
    setIsModalOpen(true);
  };

  // Handle Save (Add or Update)
  const handleSave = (e) => {
    e.preventDefault();
    if (currentDept.id) {
      // Edit
      setDepartments(departments.map(d => d.id === currentDept.id ? currentDept : d));
    } else {
      // Add
      const newId = departments.length ? departments[departments.length - 1].id + 1 : 1;
      setDepartments([...departments, { ...currentDept, id: newId }]);
    }
    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className={`bg-white border-r w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <div className="h-16 flex items-center px-6 border-b bg-gray-50 font-bold text-gray-700 text-lg">
          Admin Panel
        </div>
        <nav className="flex flex-col p-4 space-y-1">
          <a href="#dashboard" className="px-4 py-2.5 rounded text-gray-600 hover:bg-gray-100 font-medium">Dashboard</a>
          <a href="#departments" className="px-4 py-2.5 rounded bg-blue-50 text-blue-600 font-medium">Departments</a>
          <a href="#employees" className="px-4 py-2.5 rounded text-gray-600 hover:bg-gray-100 font-medium">Employees</a>
          <a href="#reports" className="px-4 py-2.5 rounded text-gray-600 hover:bg-gray-100 font-medium">Reports</a>
          <a href="#profile" className="px-4 py-2.5 rounded text-gray-600 hover:bg-gray-100 font-medium">Profile</a>
          <a href="#logout" className="px-4 py-2.5 rounded text-red-600 hover:bg-red-50 font-medium mt-auto">Logout</a>
        </nav>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700 transition"
          >
            Toggle Menu
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">John Smith</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Department Management[cite: 1]</h1>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 font-semibold text-gray-700 flex justify-between items-center">
              <span>Departments</span>
              <button 
                onClick={() => handleOpenModal()} 
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
              >
                Add New Department[cite: 1]
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                    <th className="py-3 px-4">ID[cite: 1]</th>
                    <th className="py-3 px-4">Name[cite: 1]</th>
                    <th className="py-3 px-4">Description[cite: 1]</th>
                    <th className="py-3 px-4">Actions[cite: 1]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{dept.id}</td>
                      <td className="py-3 px-4 font-medium">{dept.name}</td>
                      <td className="py-3 px-4">{dept.description}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button 
                          onClick={() => handleOpenModal(dept)}
                          className="bg-amber-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-amber-600 transition"
                        >
                          Edit[cite: 1]
                        </button>
                        <button 
                          onClick={() => handleDelete(dept.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition"
                        >
                          Delete[cite: 1]
                        </button>
                      </td>
                    </tr>
                  ))}
                  {departments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">No departments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800">
                {currentDept.id ? 'Edit Department' : 'Add New Department'}[cite: 1]
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name[cite: 1]</label>
                  <input 
                    type="text" 
                    required
                    value={currentDept.name}
                    onChange={(e) => setCurrentDept({ ...currentDept, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description[cite: 1]</label>
                  <textarea 
                    rows="3"
                    value={currentDept.description}
                    onChange={(e) => setCurrentDept({ ...currentDept, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end items-center px-6 py-3 border-t bg-gray-50 space-x-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-400 transition"
                >
                  Close[cite: 1]
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
                >
                  Save changes[cite: 1]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments
