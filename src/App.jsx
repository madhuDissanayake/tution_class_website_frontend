import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import TeacherCreateClass from './pages/TeacherCreateClass';
import CreateClass from './pages/CreateClass';
import EditClass from './pages/EditClass';
import ManageStudents from './pages/ManageStudents';
import SearchClasses from './pages/SearchClasses';
import ClassDetails from './pages/ClassDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Chatbot from './components/ui/Chatbot';
import AdminPanel from './pages/AdminPanel';
import Notifications from './pages/Notifications';
import TeacherPayment from './pages/TeacherPayment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/Paymentcancel';
import AdminEarnings from './pages/Adminearnings';

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-900 font-medium">Checking authorization...</p>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-4 pb-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teacher/create-class" element={<TeacherCreateClass />} />
            <Route path="/create-class" element={<CreateClass />} />
            <Route path="/edit-class/:id" element={<EditClass />} />
            <Route path="/manage-students/:id" element={<ManageStudents />} />
            <Route path="/search" element={<SearchClasses />} />
            <Route path="/class/:id" element={<ClassDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/payment/teacher-fee" element={<TeacherPayment />} />
<Route path="/payment/success" element={<PaymentSuccess />} />
<Route path="/payment/cancel" element={<PaymentCancel />} />
<Route path="/admin/earnings" element={<AdminEarnings />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
