import { useState, useEffect } from 'react';
import api from '../api';

const MarkAttendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  useEffect(() => {
    const checkTodayStatus = async () => {
      try {
        const response = await api.get('/api/attendance/check-today/');
        setIsCheckedIn(response.data.has_checked_in);
        if (response.data.check_in_time) {
          setCheckInTime(response.data.check_in_time);
        }
      } catch (error) {
        console.error('Error checking today\'s attendance status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTodayStatus();
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/attendance/check-in/');
      setIsCheckedIn(true);
      setCheckInTime(response.data.check_in_time);
      setMessage({ text: 'Checked in successfully!', type: 'success' });
    } catch (error) {
      console.error('Error checking in:', error);
      setMessage({ 
        text: error.response?.data?.error || 'Failed to check in.', 
        type: 'error' 
      });
    }
  };

  if (loading) {
    return <div>Loading attendance status...</div>;
  }

  // Format the ISO check-in time string into a clean readable format (YYYY-MM-DD HH:MM:SS)
  const formatCheckInTime = (isoString) => {
    if (!isoString) return '';
    const dateObj = new Date(isoString);
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    const mm = pad(dateObj.getMonth() + 1);
    const dd = pad(dateObj.getDate());
    const hh = pad(dateObj.getHours());
    const min = pad(dateObj.getMinutes());
    const ss = pad(dateObj.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const formattedIsoDate = new Date().toISOString().split('T')[0].replace(/-/g, '-'); 
  // Alternatively match YYYY-MM-DD based on system date:
  const displayDateText = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mark Attendance</h1>

        {message.text && (
          <div className={`mb-4 px-4 py-3 rounded-md font-medium ${
            message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
            Today's Attendance
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              <strong className="text-gray-900">Date:</strong> {formattedDate}
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
              <div>
                <p className="text-gray-700 mb-3">
                  <strong className="text-gray-900">Check-in Time:</strong> {formatCheckInTime(checkInTime)}
                </p>
                <p className="text-cyan-500 font-medium mb-4">
                  You are currently checked in.
                </p>
                <button
                  type="button"
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
  );
}

export default MarkAttendance
