import React, { useState } from 'react';

const initialEmployees = [
  { id: 5, name: 'David Brown', email: 'david.brown@company.com', phone: '123-456-7894', department: 'Operations', address: '654 Maple Dr, City, State' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', phone: '123-456-7891', department: 'Information Technology', address: '456 Oak Ave, City, State' },
  { id: 1, name: 'John Doe', email: 'john.doe@company.com', phone: '123-456-7890', department: 'Human Resources', address: '123 Main St, City, State' },
  { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', phone: '123-456-7892', department: 'Marketing', address: '789 Pine Rd, City, State' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@company.com', phone: '123-456-7893', department: 'Finance', address: '321 Elm St, City, State' },
];

const departments = [
  { id: 4, name: 'Finance' },
  { id: 1, name: 'Human Resources' },
  { id: 2, name: 'Information Technology' },
  { id: 3, name: 'Marketing' },
  { id: 5, name: 'Operations' },
];

const EmployeeList = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    address: '',
    password: '',
  });

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setCurrentEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        address: employee.address || '',
        password: '',
      });
    } else {
      setCurrentEmployee(null);
      setFormData({ name: '', email: '', phone: '', department: '', address: '', password: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentEmployee) {
      // Edit
      setEmployees(employees.map(emp => emp.id === currentEmployee.id ? { ...emp, ...formData } : emp));
    } else {
      // Add
      const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      setEmployees([...employees, { id: newId, ...formData }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Employee Management</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 flex justify-between items-center">
                <span>Employees</span>
                <button 
                  onClick={() => handleOpenModal()} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
                >
                  Add New Employee
                </button>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{emp.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border">{emp.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">{emp.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">{emp.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">{emp.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 border">
                          <button 
                            onClick={() => handleOpenModal(emp)} 
                            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs transition"
                          >
                            Edit
                          </button>
                          <a 
                            href={`employee_attendance.php?id=${emp.id}`} 
                            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded text-xs transition"
                          >
                            View Attendance
                          </a>
                          <button 
                            onClick={() => handleDelete(emp.id)} 
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h3>
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="text-gray-400 hover:text-gray-600 font-bold text-xl"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select 
                      required 
                      value={departments.find(d => d.name === formData.department)?.id || ''}
                      onChange={(e) => {
                        const selectedDept = departments.find(d => d.id === Number(e.target.value));
                        setFormData({ ...formData, department: selectedDept ? selectedDept.name : '' });
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea 
                    rows="3" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password (for edit).</p>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded text-sm transition"
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList
