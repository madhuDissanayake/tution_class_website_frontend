import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader, UserCheck, XCircle, AlertCircle, Users } from 'lucide-react';

const ManageStudents = () => {
  const { id: classId } = useParams();
  const { user } = useContext(AuthContext);
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classDetails, setClassDetails] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Fetch all reservations for the teacher
        const { data } = await axios.get('/api/reservations/teacher', config);
        
        // Filter reservations for this specific class
        const classReservations = data.filter(res => res.classId && res.classId._id === classId);
        setReservations(classReservations);

        if (classReservations.length > 0) {
          setClassDetails(classReservations[0].classId);
        } else {
          // If no reservations, fetch class details separately to display the title
          const classRes = await axios.get(`/api/classes/${classId}`);
          setClassDetails(classRes.data);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchStudents();
    }
  }, [user, classId]);

  const handleApprove = async (reservationId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.patch(`/api/reservations/${reservationId}/confirm`, {}, config);
      
      // Update local state
      setReservations(prev => prev.map(res => 
        res._id === reservationId ? { ...res, status: 'confirmed' } : res
      ));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to approve student');
    }
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this student's reservation?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.patch(`/api/reservations/${reservationId}/cancel`, {}, config);
      
      // Update local state
      setReservations(prev => prev.map(res => 
        res._id === reservationId ? { ...res, status: 'cancelled' } : res
      ));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to cancel student');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Manage Students
          </h1>
          {classDetails && (
            <p className="text-slate-500 mt-2 text-lg">
              Class: <span className="font-bold text-blue-600">{classDetails.title}</span> 
              {classDetails.isOnline ? " (Online)" : " (Physical)"}
            </p>
          )}
        </div>
        <Link to="/dashboard" className="text-sm font-bold bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-200 mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No students found</h3>
          <p className="text-slate-500 mt-2">There are no seat reservations for this class yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Reservation Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reservations.map(res => (
                  <tr key={res._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {res.studentId?.name || 'Unknown User'}
                    </td>
                    <td className="p-4 text-slate-500">
                      {res.studentId?.email || '-'}
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      {new Date(res.reservationDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {res.status === 'confirmed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Approved
                        </span>
                      ) : res.status === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {res.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(res._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors mr-2 shadow-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5 mr-1" /> Approve
                        </button>
                      )}
                      {res.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(res._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition-colors border border-rose-200"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
