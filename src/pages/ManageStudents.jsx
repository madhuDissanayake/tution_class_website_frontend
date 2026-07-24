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
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/reservations/teacher', config);
        
        // Filter reservations for this specific class
        const classReservations = data.filter(res => res.classId && res.classId._id === classId);
        setReservations(classReservations);

        if (classReservations.length > 0) {
          setClassDetails(classReservations[0].classId);
        } else {
          // If no reservations, fetch class details separately to display the title
          const classRes = await axios.get(import.meta.env.VITE_API_URL + `/api/classes/${classId}`);
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
      await axios.patch(import.meta.env.VITE_API_URL + `/api/reservations/${reservationId}/confirm`, {}, config);
      
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
      await axios.patch(import.meta.env.VITE_API_URL + `/api/reservations/${reservationId}/cancel`, {}, config);
      
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
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in relative">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary tracking-tight">
            Manage Students
          </h1>
          {classDetails && (
            <p className="text-slate-800 mt-2 text-lg font-medium">
              Class: <span className="text-white">{classDetails.title}</span> 
              {classDetails.isOnline ? " (Online)" : " (Physical)"}
            </p>
          )}
        </div>
        <Link to="/dashboard" className="text-sm font-medium bg-surface-800 text-slate-800 px-4 py-2 rounded-lg hover:text-white hover:bg-surface-700 transition-colors border border-surface-600">
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 mb-6 flex items-center relative z-10">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="glass-panel bg-surface-900/80 rounded-3xl shadow-card border border-surface-700 p-12 text-center relative z-10">
          <Users className="w-16 h-16 text-muted-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white">No students found</h3>
          <p className="text-slate-900 mt-2">There are no seat reservations for this class yet.</p>
        </div>
      ) : (
        <div className="glass-panel bg-surface-900/80 rounded-3xl shadow-card border border-surface-700 overflow-hidden relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-800 border-b border-surface-700 text-slate-900 text-xs uppercase font-semibold tracking-wider">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Reservation Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {reservations.map(res => (
                  <tr key={res._id} className="hover:bg-surface-800/50 transition-colors">
                    <td className="p-4 font-medium text-white">
                      {res.studentId?.name || 'Unknown User'}
                    </td>
                    <td className="p-4 text-slate-800">
                      {res.studentId?.email || '-'}
                    </td>
                    <td className="p-4 text-slate-900 text-sm">
                      {new Date(res.reservationDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {res.status === 'confirmed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Approved
                        </span>
                      ) : res.status === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-800 text-slate-800 border border-surface-600">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {res.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(res._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg transition-colors mr-2 border border-emerald-500/20"
                        >
                          <UserCheck className="w-3.5 h-3.5 mr-1" /> Approve
                        </button>
                      )}
                      {res.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(res._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium rounded-lg transition-colors border border-rose-500/20"
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
