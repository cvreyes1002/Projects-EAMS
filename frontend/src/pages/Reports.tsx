import { useAuth } from "../components/AuthContext";
import { useState } from "react";
import { Filter, Calendar, Table as TableIcon} from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  notes: string;
}

const Reports = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-30");
  const [reports, setReports] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.get("/api/attendance/report/", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      setReports(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch attendance report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter reports based on search query
  const filteredReports = reports.filter(
    (item) =>
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.checkIn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.checkOut.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredReports.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredReports.length / entriesPerPage) || 1;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isAdmin={user?.is_admin ?? false} sidebarOpen={sidebarOpen} />

      {/* Page Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Personal Attendance Reports
            </h1>

            {/* Filter Reports Container */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 text-gray-700 font-medium mb-4 pb-3 border-b border-gray-100">
                <Filter className="w-5 h-5 text-gray-600" />
                <span>Filter Reports</span>
              </div>

              <form onSubmit={handleGenerateReport}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Generate Report Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors text-sm shadow-sm disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Report"}
                </button>
              </form>
            </div>

            {/* Report Results Container */}
            {hasSearched && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 text-gray-700 font-medium mb-4 pb-3 border-b border-gray-100">
                  <TableIcon className="w-5 h-5 text-gray-600" />
                  <span>Report Results</span>
                </div>

                {/* Table Controls (Show entries & Search) */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => {
                        setEntriesPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span>Search:</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
                        <th className="py-3 px-4 font-semibold">Date</th>
                        <th className="py-3 px-4 font-semibold">Check In</th>
                        <th className="py-3 px-4 font-semibold">Check Out</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-800">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            Loading attendance records...
                          </td>
                        </tr>
                      ) : currentEntries.length > 0 ? (
                        currentEntries.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">{item.date}</td>
                            <td className="py-3 px-4">{item.checkIn}</td>
                            <td className="py-3 px-4">{item.checkOut || "-"}</td>
                            <td className="py-3 px-4">{item.status}</td>
                            <td className="py-3 px-4">{item.notes || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            No matching records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination and Entries Info */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 text-sm text-gray-600">
                  <div>
                    Showing {filteredReports.length > 0 ? indexOfFirstEntry + 1 : 0} to{" "}
                    {Math.min(indexOfLastEntry, filteredReports.length)} of{" "}
                    {filteredReports.length} entries
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 text-sm"
                    >
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-blue-600 bg-blue-600 text-white rounded text-sm font-medium">
                      {currentPage}
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;