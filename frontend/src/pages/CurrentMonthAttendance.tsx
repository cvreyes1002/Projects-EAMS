import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import api from '../api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  notes: string;
}

const CurrentMonthAttendance = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamically get the current month and year string (e.g., "October 2026")
  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Use the configured axios instance which automatically handles the Authorization header via interceptors
        const response = await api.get('/api/attendance/current-month/');
        setAttendanceData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Filter records based on search input
  const filteredData = attendanceData.filter((item) =>
    Object.values(item).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isAdmin={user?.is_admin ?? false} sidebarOpen={sidebarOpen} />

      {/* Page Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Component */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Current Month Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">Attendance records for {currentMonthName}</p>
      </div>

      {/* Card Container */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {/* Card Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center text-gray-700 font-semibold gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Attendance History
          </div>
          
          {/* Search Input for filtering table */}
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Card Body / Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-600">
            <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-700">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Check In</th>
                <th className="px-6 py-3">Check Out</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    Loading attendance records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{row.date}</td>
                    <td className="px-6 py-4">{row.checkIn || '-'}</td>
                    <td className="px-6 py-4">{row.checkOut || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        row.status === 'Present' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{row.notes || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No attendance records found for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default CurrentMonthAttendance;