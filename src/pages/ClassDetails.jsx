import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, ArrowLeft, Book, Globe, Loader, MessageCircle, X, Star, CreditCard, CheckCircle2, Clock } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Map from '../components/ui/Map';

const PAYHERE_SCRIPT_ID = 'payhere-checkout-script';

const loadPayHereScript = () =>
  new Promise((resolve, reject) => {
    if (document.getElementById(PAYHERE_SCRIPT_ID)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = PAYHERE_SCRIPT_ID;
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

const currentMonthLabel = () => {
  const d = new Date();
  return d.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const ClassDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  // ── Monthly fee payment state ──
  const [reservationStatus, setReservationStatus] = useState(null); // null | 'pending' | 'confirmed' | 'cancelled'
  const [paymentStatus, setPaymentStatus] = useState(null); // 'unpaid' | 'pending' | 'completed' | 'failed' | 'cancelled'
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState(null);

  const authConfig = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : null;

  const fetchReservationAndPaymentStatus = useCallback(async () => {
    if (!user || user.role !== 'student' || !authConfig) return;

    try {
      const { data: myReservations } = await axios.get(
        import.meta.env.VITE_API_URL + '/api/reservations/my',
        authConfig
      );
      const match = myReservations.find((r) => (r.classId?._id || r.classId) === id);
      setReservationStatus(match ? match.status : null);

      if (match?.status === 'confirmed') {
        const { data: pay } = await axios.get(
          import.meta.env.VITE_API_URL + `/api/payment/class/${id}/status`,
          authConfig
        );
        setPaymentStatus(pay.status);
      }
    } catch (err) {
      console.error('Failed to fetch reservation/payment status', err);
    }
  }, [id, user]);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(import.meta.env.VITE_API_URL + `/api/classes/${id}`);
        setCls(data);

        const reviewsRes = await axios.get(import.meta.env.VITE_API_URL + `/api/classes/${id}/reviews`);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch class details');
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id]);

  useEffect(() => {
    fetchReservationAndPaymentStatus();
    loadPayHereScript().catch(() => console.error('Failed to load PayHere script'));
  }, [fetchReservationAndPaymentStatus]);

  const handleReserve = async () => {
    if (!user || !user.token) {
      setError('Please login to reserve a seat');
      return;
    }

    try {
      setReserveLoading(true);
      setError(null);
      setSuccessMessage(null);

      await axios.post(import.meta.env.VITE_API_URL + '/api/reservations', { classId: id }, authConfig);
      setSuccessMessage('Your seat has been reserved successfully! Awaiting admin approval.');
      setCls((prev) => ({ ...prev, availableSeats: prev.availableSeats - 1 }));
      setReservationStatus('pending');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reserve seat');
    } finally {
      setReserveLoading(false);
    }
  };

  const handlePayMonthlyFee = async () => {
    try {
      setPayLoading(true);
      setPayError(null);

      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + `/api/payment/class/${id}/initiate`,
        {},
        authConfig
      );

      if (!window.payhere) {
        await loadPayHereScript();
      }

      window.payhere.onCompleted = function () {
        setPaymentStatus('completed');
        setPayLoading(false);
      };

      window.payhere.onDismissed = function () {
        setPayLoading(false);
        setPayError('Payment was cancelled.');
      };

      window.payhere.onError = function (err) {
        setPayLoading(false);
        setPayError('Payment error: ' + err);
      };

      window.payhere.startPayment(data);
    } catch (err) {
      setPayLoading(false);
      setPayError(err?.response?.data?.message || 'Could not start payment. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    try {
      setMessageSending(true);
      setError(null);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(import.meta.env.VITE_API_URL + '/api/notifications/message', {
        receiverId: cls.teacherId?._id || cls.teacher?._id || cls.teacherId,
        classId: cls._id,
        message: messageContent
      }, config);
      setMessageSuccess('Message sent to teacher successfully!');
      setMessageContent('');
      setTimeout(() => {
        setShowMessageModal(false);
        setMessageSuccess(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setMessageSending(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      setReviewError('Please login to submit a review');
      return;
    }
    if (rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      setReviewError('Please write a comment');
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError(null);
      setReviewSuccess(null);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post(import.meta.env.VITE_API_URL + `/api/classes/${id}/reviews`, { rating, comment }, config);
      setReviewSuccess('Review submitted successfully!');
      setRating(0);
      setComment('');

      const [classRes, reviewsRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL + `/api/classes/${id}`),
        axios.get(import.meta.env.VITE_API_URL + `/api/classes/${id}/reviews`)
      ]);
      setCls(classRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading class details...</p>
      </div>
    );
  }

  if (error && !cls) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-2xl text-center space-y-6 animate-fade-in bg-surface-800 shadow-sm mt-12 border border-rose-900">
        <div className="bg-rose-900/30 text-rose-500 p-4 rounded-xl font-medium border border-rose-800">
          {error}
        </div>
        <Link
          to="/search"
          className="inline-flex items-center text-primary-light hover:underline font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Search
        </Link>
      </div>
    );
  }

  if (!cls) return null;

  return (
    <div className="relative w-full min-h-screen pb-20">
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-surface-950">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-500/15 dark:bg-sky-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-indigo-500/10 dark:bg-blue-400/15 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 animate-slide-up py-8 px-4 md:px-0 relative z-10">
      {/* Premium Billboard Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/5 border border-surface-700/50 bg-surface-900/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-800 via-surface-900 to-surface-950 z-0" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />

        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] z-0" />

        <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-surface-800/50 hover:bg-surface-800 backdrop-blur-md text-white px-3 py-1.5 rounded-lg transition-all duration-300 border border-surface-700 text-sm font-semibold hover:-translate-x-1 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Search
            </Link>
            <span className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {cls.subject}
            </span>
          </div>

          <div className="mt-6 flex flex-col md:flex-row justify-between items-end gap-4 w-full">
            <div className="text-left space-y-1.5">
              <h1 className="text-2xl md:text-4xl font-medium text-white tracking-tight leading-none">
                {cls.title}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-8 h-8 rounded-full border border-surface-600 bg-surface-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {cls.teacherId?.profilePicture || cls.teacher?.profilePicture ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL}${cls.teacherId?.profilePicture || cls.teacher?.profilePicture}`} 
                      alt={cls.teacherId?.name || cls.teacher?.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-[12px] font-bold text-white">
                      {(cls.teacherId?.name || cls.teacher?.name)?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <p className="text-base md:text-lg text-muted-400 font-medium flex items-center gap-2">
                  By <span className="text-primary-light font-medium">{cls.teacherId?.name || cls.teacher?.name || 'Unknown Teacher'}</span>
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-4 md:p-5 text-right shadow-glow-primary shrink-0 relative overflow-hidden group border border-white/10">
              {/* Decorative light flair */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 blur-xl rounded-full group-hover:scale-150 transition-transform duration-700" />

              <span className="relative z-10 text-4xl md:text-5xl font-black text-white leading-none tracking-tight drop-shadow-sm">Rs. {cls.fee}</span>
              <span className="relative z-10 text-white/80 block text-[10px] md:text-xs font-bold mt-1.5 uppercase tracking-[1px] opacity-90">per month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Alerts / Feedback Banners */}
          {successMessage && (
            <div className="bg-emerald-50 text-emerald-800 p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between animate-fade-in animate-pulse-green">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="font-medium text-sm md:text-base">{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-800 hover:text-emerald-950 font-black text-xl leading-none px-2">×</button>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 text-rose-800 p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between animate-fade-in">
              <span className="font-medium text-sm md:text-base">{error}</span>
              <button onClick={() => setError(null)} className="text-rose-800 hover:text-rose-950 font-black text-xl leading-none px-2">×</button>
            </div>
          )}

          {/* Description Section */}
          <div className="bg-surface-900/60 backdrop-blur-xl border border-surface-700/50 rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-medium text-white tracking-tight">About this class</h3>
              <div className="w-10 h-1 bg-primary rounded-full mt-1.5" />
            </div>
            <p className="text-muted-400 leading-relaxed font-medium text-sm md:text-base">{cls.description}</p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 border-t border-surface-800 pt-6 mt-6">
              <div className="bg-surface-800/50 border border-surface-700 p-5 rounded-xl text-center flex flex-col items-center justify-center space-y-1">
                <Book className="w-5 h-5 text-primary-light mb-1" />
                <span className="text-[10px] text-white opacity-50 font-medium uppercase tracking-[1px]">Grade</span>
                <span className="text-base text-white font-semibold">{cls.grade}</span>
              </div>
              <div className="bg-surface-800/50 border border-surface-700 p-5 rounded-xl text-center flex flex-col items-center justify-center space-y-1">
                <Users className="w-5 h-5 text-secondary mb-1" />
                <span className="text-[10px] text-white opacity-50 font-medium uppercase tracking-[1px]">Seats Free</span>
                <span className="text-base text-white font-semibold">{cls.availableSeats} / {cls.capacity}</span>
              </div>
              <div className="bg-surface-800/50 border border-surface-700 p-5 rounded-xl text-center flex flex-col items-center justify-center space-y-1">
                <Globe className="w-5 h-5 text-primary-light mb-1" />
                <span className="text-[10px] text-white opacity-50 font-medium uppercase tracking-[1px]">Medium</span>
                <span className="text-base text-white font-semibold">{cls.medium}</span>
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-surface-900/60 backdrop-blur-xl border border-surface-700/50 rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-medium text-white tracking-tight">Class Schedule</h3>
              <div className="w-10 h-1 bg-primary rounded-full mt-1.5" />
            </div>

            {cls.schedule && cls.schedule.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cls.schedule.map((slot, index) => (
                  <div key={index} className="hover:shadow-card-hover hover:-translate-y-0.5 rounded-xl p-3 flex items-center justify-between bg-surface-800/50 border border-surface-700/50 transition-all duration-300">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-primary-dark/30 text-primary-light rounded-lg shadow-sm">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-500 font-medium uppercase tracking-wider block">Day</span>
                        <span className="font-medium text-white text-sm">{slot.day}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-500 font-medium uppercase tracking-wider block">Time</span>
                      <span className="font-medium text-white text-xs">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-400 font-medium italic text-sm">No schedule rows defined for this class.</p>
            )}
          </div>

          {/* Reviews & Ratings Section */}
          <div className="bg-surface-900/60 backdrop-blur-xl border border-surface-700/50 rounded-2xl p-6 md:p-8 space-y-6 mt-8">
            <div>
              <h3 className="text-lg font-medium text-white tracking-tight">Reviews & Ratings</h3>
              <div className="w-8 h-1 bg-amber-500 rounded-full mt-1" />
            </div>

            <div className="flex items-center gap-3 border-b border-surface-800 pb-4">
              <div className="text-3xl font-black text-white">
                {cls.avgRating ? cls.avgRating.toFixed(1) : '0.0'}
              </div>
              <div>
                <div className="flex gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(cls.avgRating || 0) ? 'text-amber-500 fill-amber-500' : 'text-surface-600'}`}
                    />
                  ))}
                </div>
                <p className="text-xs font-semibold text-muted-400">
                  Based on {cls.reviewCount || 0} reviews
                </p>
              </div>
            </div>

            {/* List Reviews */}
            <div className="space-y-3">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="bg-surface-800/50 rounded-xl p-3 border border-surface-700">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-dark/50 flex items-center justify-center text-primary-light font-medium text-xs">
                          {review.studentId?.name ? review.studentId.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <span className="font-medium text-white text-xs">{review.studentId?.name || 'Student'}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-surface-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-400 text-xs font-medium">{review.comment}</p>
                    <p className="text-[9px] text-muted-500 font-medium mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-surface-800/30 border border-dashed border-surface-700 rounded-xl text-center">
                  <div className="w-12 h-12 bg-primary-dark/30 text-primary-light rounded-full flex items-center justify-center mb-3">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <p className="text-muted-400 font-medium mb-3">No reviews yet</p>
                  <button
                    onClick={() => {
                      const form = document.getElementById('review-form');
                      if (form) {
                        form.scrollIntoView({ behavior: 'smooth' });
                        const textarea = form.querySelector('textarea');
                        if (textarea) setTimeout(() => textarea.focus(), 500);
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 bg-surface-800 border border-surface-700 hover:border-primary text-primary-light font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    Be the first to review!
                  </button>
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            {user?.role === 'student' && (
              <div id="review-form" className="mt-4 pt-4 border-t border-surface-800">
                <h4 className="text-base font-medium text-white mb-3">Write a Review</h4>

                {reviewSuccess && (
                  <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl mb-3 text-xs font-medium border border-emerald-100/60 text-center">
                    {reviewSuccess}
                  </div>
                )}

                {reviewError && (
                  <div className="bg-rose-50 text-rose-600 p-2.5 rounded-xl mb-3 text-xs font-medium border border-rose-100/60 text-center">
                    {reviewError}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-muted-500 uppercase tracking-wider mb-1.5">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-0.5 focus:outline-none transition-transform hover:scale-110 ${rating >= star ? 'text-amber-500' : 'text-surface-600 hover:text-amber-200'}`}
                        >
                          <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-500' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-muted-500 uppercase tracking-wider mb-1.5">Comment</label>
                    <textarea
                      className="w-full px-3 py-2 border border-surface-700 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none text-xs font-medium bg-surface-800 text-white transition-all"
                      rows="2"
                      placeholder="Share your experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg text-xs transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {reviewLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Map & Action */}
        <div className="space-y-8">
          {/* Reservation Card / Call to Action */}
          <div className="bg-surface-900/60 backdrop-blur-xl border border-surface-700/50 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-card">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/20 to-transparent rounded-full -mr-8 -mt-8 blur-xl pointer-events-none" />
            <h4 className="text-lg font-medium text-white relative z-10">Reserve Your Seat</h4>
            <p className="text-muted-400 font-medium text-sm leading-relaxed relative z-10">Join this cohort of students today. Secure your admission to learn directly from {cls.teacherId?.name || cls.teacher?.name || 'our highly specialized teacher'}.</p>

            <div className="relative z-10 mt-2 space-y-3">
              {user?.role === 'student' ? (
                reservationStatus === 'confirmed' ? (
                  // ── Already confirmed: show monthly fee payment section ──
                  <div className="space-y-3">
                    {paymentStatus === 'completed' ? (
                      <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 flex items-center gap-3 border border-emerald-100">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Paid for {currentMonthLabel()}</p>
                          <p className="text-xs opacity-80">You're all set for this month.</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {payError && (
                          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-medium border border-rose-100 text-center">
                            {payError}
                          </div>
                        )}
                        <button
                          onClick={handlePayMonthlyFee}
                          disabled={payLoading}
                          className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-5 rounded-xl shadow-glow-primary disabled:opacity-50 transition-all transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {payLoading ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Redirecting to PayHere...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              Pay Rs. {cls.fee} for {currentMonthLabel()}
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                ) : reservationStatus === 'pending' ? (
                  <div className="bg-amber-50 text-amber-700 rounded-xl p-4 flex items-center gap-3 border border-amber-100">
                    <Clock className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Reservation pending</p>
                      <p className="text-xs opacity-80">Waiting for admin approval before you can pay.</p>
                    </div>
                  </div>
                ) : cls.availableSeats > 0 ? (
                  <button
                    onClick={handleReserve}
                    disabled={reserveLoading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-5 rounded-xl shadow-glow-primary disabled:opacity-50 transition-all transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {reserveLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Reserving...
                      </>
                    ) : (
                      'Reserve My Seat Now'
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-surface-800 text-muted-500 font-medium py-3 px-5 rounded-xl shadow-sm cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    Class is full. No seats available.
                  </button>
                )
              ) : !user ? (
                <div className="space-y-3">
                  <p className="text-muted-500 italic text-xs font-semibold">Please log in as a student to reserve your seat.</p>
                  <Link
                    to="/login"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-5 rounded-xl shadow-glow-primary transition-all transform hover:-translate-y-0.5 text-center block text-sm"
                  >
                    Log In
                  </Link>
                </div>
              ) : (
                <div className="bg-surface-800/50 border border-surface-700/50 rounded-xl p-3 text-center backdrop-blur-sm">
                  <p className="text-muted-500 italic text-xs font-semibold">Seat reservation is exclusive to students. Currently logged in as a {user.role}.</p>
                </div>
              )}

              {user?.role === 'student' && (
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full mt-3 bg-surface-800 hover:bg-primary/20 text-primary-light font-medium py-3 px-5 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 border border-primary-dark/20"
                >
                  <MessageCircle className="w-4 h-4" /> Message Teacher
                </button>
              )}
            </div>
          </div>

          {/* Location / Google Map Container */}
          {cls.location && cls.location.coordinates && cls.location.coordinates.length === 2 && (
            <div className="bg-surface-900/60 backdrop-blur-xl border border-surface-700/50 rounded-2xl p-6 md:p-8 space-y-6 shadow-card relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full -ml-8 -mb-8 blur-xl pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-primary-dark/40 rounded-lg text-primary-light border border-primary-dark/50 shadow-inner">
                  <MapPin className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-white">Class Location</h4>
                  <p className="text-[10px] text-muted-500 font-medium uppercase tracking-wider">Address details</p>
                </div>
              </div>

              {cls.location.address && (
                <div className="bg-surface-800/80 border border-surface-700/50 rounded-xl p-3 text-xs md:text-sm font-semibold text-muted-400 relative z-10 backdrop-blur-sm">
                  {cls.location.address}
                </div>
              )}

              {/* Map Holder */}
              <div className="h-48 rounded-xl overflow-hidden border border-surface-700/80 shadow-inner bg-surface-900 relative z-10">
                <Map
                  locations={[{
                    lat: cls.location.coordinates[1],
                    lng: cls.location.coordinates[0],
                    title: cls.title
                  }]}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-900 border border-surface-700 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setShowMessageModal(false)}
              className="absolute top-4 right-4 p-2 bg-surface-800 hover:bg-surface-700 rounded-full text-muted-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-white mb-2">Ask a Question</h3>
            <p className="text-muted-500 text-sm font-medium mb-6">Send a private message to {cls.teacherId?.name || 'the teacher'}.</p>

            {messageSuccess ? (
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-center font-medium mb-4">
                {messageSuccess}
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  className="w-full h-32 px-4 py-3 border border-surface-600 rounded-2xl focus:ring-2 focus:ring-primary outline-none resize-none text-white bg-surface-800 font-medium"
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                ></textarea>
                <button
                  onClick={handleSendMessage}
                  disabled={messageSending || !messageContent.trim()}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {messageSending ? <Loader className="w-5 h-5 animate-spin" /> : 'Send Message'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetails;