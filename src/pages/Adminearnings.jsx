import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Loader, TrendingUp, Wallet, Users, Clock, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const monthLabel = (ym) => {
  if (!ym) return '';
  const [y, m] = ym.split('-');
  const d = new Date(Number(y), Number(m) - 1);
  return d.toLocaleString('default', { month: 'short', year: '2-digit' });
};

const AdminEarnings = () => {
  const { user } = useContext(AuthContext);
  const [overview, setOverview] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const authConfig = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : null;

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [{ data: overviewData }, { data: withdrawalsData }] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL + '/api/earnings/admin/overview', authConfig),
        axios.get(import.meta.env.VITE_API_URL + '/api/earnings/admin/withdrawals?status=pending', authConfig)
      ]);
      setOverview(overviewData);
      setWithdrawals(withdrawalsData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load earnings overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handlePay = async (id) => {
    if (!window.confirm('Confirm this withdrawal has been paid out to the teacher?')) return;
    try {
      setProcessingId(id);
      setActionError(null);
      await axios.patch(import.meta.env.VITE_API_URL + `/api/earnings/admin/withdrawals/${id}/pay`, {}, authConfig);
      await fetchAll();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to mark as paid');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const note = window.prompt('Optional reason for rejecting this withdrawal:');
    if (note === null) return; // cancelled prompt
    try {
      setProcessingId(id);
      setActionError(null);
      await axios.patch(import.meta.env.VITE_API_URL + `/api/earnings/admin/withdrawals/${id}/reject`, { adminNote: note }, authConfig);
      await fetchAll();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to reject withdrawal');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader className="w-12 h-12 text-primary animate-spin" />
        <p className="text-slate-900 font-medium animate-pulse">Loading earnings overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center mt-20 p-8 bg-slate-50 rounded-3xl border border-rose-900 shadow-card">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <p className="text-rose-400 font-medium">{error}</p>
      </div>
    );
  }

  if (!overview) return null;

  const chartData = overview.monthlyTrend.map((m) => ({
    month: monthLabel(m._id),
    'Gross Revenue': m.grossRevenue,
    'Platform Commission': m.platformCommission,
    'Teacher Earnings': m.teacherEarnings
  }));

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 md:px-0 min-h-[80vh] space-y-8 animate-slide-up bg-blue-50/50 p-6 md:p-8 rounded-[32px] border border-blue-100 min-h-[80vh]">
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
          Platform <span className="text-primary-light">Earnings</span>
        </h1>
        <p className="text-slate-800 font-medium text-lg mt-2">
          Commission rate: <span className="text-slate-800 font-semibold">{(overview.commissionRate * 100).toFixed(0)}%</span> of every class monthly fee
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-blue-50/30 shadow-sm border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" /> Gross Revenue
          </div>
          <p className="text-2xl font-black text-slate-800">Rs. {overview.summary.totalGrossRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-slate-900 font-medium">{overview.summary.totalTransactions} transactions</p>
        </div>

        <div className="bg-blue-50/30 shadow-sm border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 text-xs font-semibold uppercase tracking-wider">
            <Wallet className="w-4 h-4" /> Total Admin Earnings
          </div>
          <p className="text-2xl font-black text-primary-light">Rs. {overview.summary.totalPlatformCommission.toLocaleString()}</p>
          <div className="text-[11px] text-slate-900 font-medium space-y-0.5 pt-1">
            <p className="flex justify-between"><span>From Classes (10%):</span> <span className="text-slate-800">Rs. {(overview.summary.classCommission || 0).toLocaleString()}</span></p>
            <p className="flex justify-between"><span>From Teacher Reg.:</span> <span className="text-slate-800">Rs. {(overview.summary.registrationRevenue || 0).toLocaleString()}</span></p>
          </div>
        </div>

        <div className="bg-blue-50/30 shadow-sm border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 text-xs font-semibold uppercase tracking-wider">
            <Users className="w-4 h-4" /> Teacher Earnings
          </div>
          <p className="text-2xl font-black text-emerald-400">Rs. {overview.summary.totalTeacherEarnings.toLocaleString()}</p>
          <p className="text-[11px] text-slate-900 font-medium">Paid + owed to teachers</p>
        </div>

        <div className="bg-blue-50/30 shadow-sm border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-4 h-4" /> Pending Withdrawals
          </div>
          <p className="text-2xl font-black text-amber-400">Rs. {overview.pendingWithdrawalSummary.total.toLocaleString()}</p>
          <p className="text-[11px] text-slate-900 font-medium">{overview.pendingWithdrawalSummary.count} requests awaiting action</p>
        </div>
      </div>

      {/* Charts — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Revenue Split */}
        <div className="bg-blue-50/30 shadow-sm border border-blue-100 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Monthly Revenue Split</h3>
            <span className="text-[10px] font-semibold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">Stacked</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', fontSize: 12 }}
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                <Bar dataKey="Teacher Earnings" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Platform Commission" stackId="a" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gross Revenue Trend */}
        <div className="bg-blue-50/30 shadow-sm border border-blue-100 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Gross Revenue Trend</h3>
            <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">Monthly</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', fontSize: 12 }}
                  cursor={{ stroke: '#38bdf8', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line type="monotone" dataKey="Gross Revenue" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3, fill: '#38bdf8', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Earning Teachers */}
      <div className="bg-blue-50/30 shadow-sm border border-blue-100 rounded-2xl overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Top Earning Teachers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="text-left px-5 py-3 font-semibold">Teacher</th>
                <th className="text-right px-5 py-3 font-semibold">Total Earned</th>
                <th className="text-right px-5 py-3 font-semibold">Commission Generated</th>
                <th className="text-right px-5 py-3 font-semibold">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {overview.topTeachers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-800 font-medium">No earnings recorded yet.</td>
                </tr>
              ) : (
                overview.topTeachers.map((t) => (
                  <tr key={t.teacherId} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-slate-800 font-medium">{t.name}</p>
                      <p className="text-slate-900 text-xs">{t.email}</p>
                    </td>
                    <td className="px-5 py-3 text-right text-emerald-400 font-semibold">Rs. {t.totalEarned.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-primary-light font-semibold">Rs. {t.totalCommissionGenerated.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-slate-800">{t.transactions}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Withdrawal Requests */}
      <div className="bg-blue-50/30 shadow-sm border border-blue-100 rounded-2xl overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Pending Withdrawal Requests</h3>
          <span className="text-xs bg-amber-900/30 text-amber-400 border border-amber-800 font-semibold px-2.5 py-1 rounded-full">
            {withdrawals.length} pending
          </span>
        </div>

        {actionError && (
          <div className="bg-rose-50 text-rose-600 p-3 mx-5 mt-4 rounded-xl text-xs font-medium border border-rose-100 text-center">
            {actionError}
          </div>
        )}

        <div className="p-4 md:p-6 space-y-3">
          {withdrawals.length === 0 ? (
            <p className="text-center text-slate-800 font-medium py-6">No pending withdrawal requests.</p>
          ) : (
            withdrawals.map((w) => (
              <div key={w._id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-slate-800 font-semibold">{w.teacher?.name}</p>
                  <p className="text-slate-900 text-xs">{w.teacher?.email} · {w.teacher?.phone}</p>
                  <p className="text-slate-800 font-black text-lg mt-1">Rs. {w.amount.toLocaleString()}</p>
                  {w.payoutDetails?.accountNumber && (
                    <p className="text-slate-800 text-xs font-medium mt-1">
                      {w.payoutDetails.bankName} · {w.payoutDetails.accountName} · {w.payoutDetails.accountNumber}
                      {w.payoutDetails.branch ? ` (${w.payoutDetails.branch})` : ''}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handlePay(w._id)}
                    disabled={processingId === w._id}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {processingId === w._id ? '...' : 'Mark Paid'}
                  </button>
                  <button
                    onClick={() => handleReject(w._id)}
                    disabled={processingId === w._id}
                    className="bg-rose-900/30 hover:bg-rose-600 hover:text-slate-800 text-rose-400 font-semibold text-xs py-2 px-4 rounded-lg border border-rose-800 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEarnings;