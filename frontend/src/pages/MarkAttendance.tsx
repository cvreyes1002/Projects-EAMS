import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../components/AuthContext";

const MarkAttendance = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Format date as YYYY-MM-DD
  const todayDate = new Date().toISOString().split("T")[0];

  // const formattedDate = new Intl.DateTimeFormat('en-US', {
  //   weekday: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  // }).format(new Date());

  useEffect(() => {
    const checkTodayStatus = async () => {
      try {
        const response = await api.get("/api/attendance/check-today/");
        setIsCheckedIn(response.data.has_checked_in);

        if (response.data.check_in_time) {
          setCheckInTime(response.data.check_in_time);
        }

        if (response.data.check_out_time) {
          setCheckOutTime(response.data.check_out_time);
          setIsCheckedOut(true);
        }
      } catch (error) {
        console.error("Error checking today's attendance status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkTodayStatus();
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/attendance/check-in/");
      setIsCheckedIn(true);
      setCheckInTime(response.data.check_in_time);
      setMessage({ text: "Checked in successfully!", type: "success" });
    } catch (error) {
      console.error("Error checking in:", error);
      setMessage({
        text: error.response?.data?.error || "Failed to check in.",
        type: "error",
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await api.post("/api/attendance/check-out/");
      setCheckOutTime(response.data.check_out_time);
      setIsCheckedOut(true);
      setMessage({ text: "Checked out successfully!", type: "success" });
    } catch (error) {
      console.error("Error checking out:", error);
      setMessage({
        text: error.response?.data?.error || "Failed to check out.",
        type: "error",
      });
    }
  };

  // Format ISO string into YYYY-MM-DD HH:MM:SS
  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return "";
    const dateObj = new Date(isoString);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    const mm = pad(dateObj.getMonth() + 1);
    const dd = pad(dateObj.getDate());
    const hh = pad(dateObj.getHours());
    const min = pad(dateObj.getMinutes());
    const ss = pad(dateObj.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  if (loading) {
    return <div>Loading attendance status...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isAdmin={user?.is_admin ?? false} sidebarOpen={sidebarOpen} />

      {/* Page Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Component */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="min-h-screen bg-gray-50 p-6">
          {/* <div className="max-w-4xl mx-auto"> */}
          <div className="w-full max-w-6xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Mark Attendance
            </h1>

            {/* Success / Error Message Banner */}
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-md text-gray-800 border ${
                  message.type === "success"
                    ? "bg-[#d1e7dd] text-[#0f5132] border-[#badbcc]"
                    : "bg-red-100 text-red-700 border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 text-gray-700 font-normal">
                Today's Attendance
              </div>
              <div className="p-6 space-y-4 text-gray-800">
                <p className="text-gray-900">
                  <strong>Date:</strong> {todayDate}
                </p>

                {!isCheckedIn ? (
                  /* State 1: Not checked in */
                  <div>
                    <p className="text-amber-600 font-medium mb-4">
                      You have not checked in yet today.
                    </p>
                    <form onSubmit={handleCheckIn}>
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition duration-200 shadow-sm"
                      >
                        Check In
                      </button>
                    </form>
                  </div>
                ) : isCheckedOut ? (
                  /* State 2: Checked out (Matches target image) */
                  <div className="space-y-4">
                    <p className="text-gray-900">
                      <strong>Check-in Time:</strong>{" "}
                      {formatDateTime(checkInTime)}
                    </p>
                    <p className="text-gray-900">
                      <strong>Check-out Time:</strong>{" "}
                      {formatDateTime(checkOutTime)}
                    </p>
                    <p className="text-[#198754] font-medium pt-2">
                      You have completed your attendance for today.
                    </p>
                  </div>
                ) : (
                  /* State 3: Checked in, waiting for check out */
                  <div>
                    <p className="text-gray-900 mb-3">
                      <strong>Check-in Time:</strong>{" "}
                      {formatDateTime(checkInTime)}
                    </p>
                    <p className="text-cyan-600 font-medium mb-4">
                      You are currently checked in.
                    </p>
                    <button
                      type="button"
                      onClick={handleCheckOut}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition duration-200 shadow-sm"
                    >
                      Check Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
