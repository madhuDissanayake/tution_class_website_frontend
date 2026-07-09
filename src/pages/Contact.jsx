import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/contact', formData);
      setStatus('Message sent successfully! Our team will get back to you shortly.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen pt-4 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 relative z-10">
           <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-3">Get in Touch</h1>
           <p className="text-base text-slate-600 dark:text-slate-400 font-medium mb-8">Have questions about our classes or need help? We are here for you.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Phone & WhatsApp</h3>
                <div className="flex flex-col space-y-1">
                  <a href="tel:+94779803887" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-2 h-px bg-blue-600 dark:bg-blue-400 mr-0 group-hover:mr-1.5 transition-all duration-300"></span>
                    Call: +94 77 980 3887
                  </a>
                  <a href="https://wa.me/94779803887" target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-600 dark:bg-emerald-400 mr-0 group-hover:mr-1.5 transition-all duration-300"></span>
                    WhatsApp Message
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Email</h3>
                <a href="mailto:tuitionhub0011@gmail.com" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-px bg-blue-600 dark:bg-blue-400 mr-0 group-hover:mr-1.5 transition-all duration-300"></span>
                  tuitionhub0011@gmail.com
                </a>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Working Hours</h3>
                <p className="text-sm text-slate-500">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-sm text-slate-500">Saturday: 8:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-700/50">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-6">Send us a message</h2>
              
              {status && (
                <div className="mb-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl flex items-center text-sm font-medium animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                      placeholder="Nimal Perera"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                      placeholder="nimal@example.com"
                    />
                  </div>
                </div>


                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                  <textarea 
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 dark:text-white resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-sm rounded-lg shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Sending...</span>
                  ) : (
                    <span className="flex items-center"><Send className="w-5 h-5 mr-2" /> Send Message</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
