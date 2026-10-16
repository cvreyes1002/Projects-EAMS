import { useState } from 'react';

const MarkAttendance = () => {
  // Simulating check-in state (can be replaced with actual API state)
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const currentDate = "2026-10-16";

  const handleCheckIn = (e) => {
    e.preventDefault();
    // Add your check-in API call or logic here
    setIsCheckedIn(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mark Attendance</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
            Today's Attendance
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              <strong className="text-gray-900">Date:</strong> {currentDate}
            </p>

            {!isCheckedIn ? (
              <>
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
              </>
            ) : (
              <p className="text-green-600 font-medium">
                You have successfully checked in for today!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance
