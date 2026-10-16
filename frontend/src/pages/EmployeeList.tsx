import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../components/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface Department {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Employee {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  department?: number | string | Department;
  address?: string;
}

const EmployeeList = () => {
  const { user, register } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // Fetch departments from the backend
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/api/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    // Fetch employees from the backend
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/api/users/");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    tel_no: "",
    department: "" as number | "",
    address: "",
    password: "",
  });

  const handleOpenModal = (employee: any = null) => {
    if (employee) {
      setCurrentEmployee(employee);
      // Extract ID if department is returned as an object from the backend
      const deptId =
        typeof employee.department === "object" && employee.department !== null
          ? employee.department.id
          : employee.department || "";

      setFormData({
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        email: employee.email,
        tel_no: employee.tel_no || "",
        department: deptId,
        address: employee.address || "",
        password: "",
      });
    } else {
      setCurrentEmployee(null);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        tel_no: "",
        department: "",
        address: "",
        password: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentEmployee) {
      // Edit
      setEmployees(
        employees.map((emp) =>
          emp.id === currentEmployee.id ? { ...emp, ...formData } : emp,
        ),
      );
    } else {
      // Add
      try {
        await register(
          formData.first_name,
          formData.last_name,
          formData.email,
          formData.password,
          formData.tel_no,
          formData.department ? Number(formData.department) : undefined,
          formData.address,
        );
      } catch (error) {
        console.error("Error adding employee:", error);
      }
      // const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      // setEmployees([...employees, { id: newId, ...formData }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isAdmin={user?.is_admin ?? false} sidebarOpen={sidebarOpen} />

      {/* Page Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Component */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex h-screen bg-gray-100">
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
              <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Employee Management
                </h1>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                              {emp.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border">
                              {`${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
                                "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                              {emp.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                              {emp.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                              {typeof emp.department === "object" &&
                              emp.department !== null
                                ? (emp.department as Department).name
                                : departments.find(
                                    (d) => d.id === Number(emp.department),
                                  )?.name || "—"}
                            </td>
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
                      {currentEmployee ? "Edit Employee" : "Add New Employee"}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.first_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              first_name: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.last_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              last_name: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <select
                          required
                          value={formData.department}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              department: e.target.value
                                ? Number(e.target.value)
                                : "",
                            });
                          }}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        rows="3"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave blank to keep current password (for edit).
                      </p>
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
      </div>
    </div>
  );
};

export default EmployeeList;
