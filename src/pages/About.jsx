import { Sparkles, Users, BookOpen, Target, Heart, Shield, Bot, Map, CalendarCheck, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';

const About = () => {
  return (
    <div className="w-full bg-white overflow-hidden min-h-screen">
      
      {/* Hero Section */}
      <section className="relative px-6 pt-6 pb-12 text-center z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] -z-10"></div>
        
        <div className="inline-flex items-center space-x-2.5 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-xs font-medium text-blue-700 mb-6 shadow-sm">
          <Logo iconOnly className="w-4 h-4" />
          <span>Our Story</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Redefining Education in <span className="text-blue-600">Sri Lanka</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-slate-800 font-medium leading-relaxed mb-12">
          TuitionHub was founded with a single mission: to connect passionate educators with ambitious students across the island, breaking down geographical barriers to quality education.
        </p>

        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-slate-200 relative group ring-4 ring-white/10 ">
          <img 
            src="/images/srilankan_students_classroom_v2.png" 
            alt="Sri Lankan Students learning together" 
            className="w-full h-[350px] md:h-[500px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent pointer-events-none mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none opacity-60"></div>
          
          <div className="absolute bottom-8 left-8 md:bottom-10 md:left-12 text-left pointer-events-none">
            <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg mb-3 shadow-lg">Our Vision in Action</div>
            <p className="text-white font-black text-2xl md:text-4xl drop-shadow-lg mb-2">Empowering the next generation</p>
            <p className="text-slate-200 font-medium text-sm md:text-base drop-shadow-md max-w-lg">Building the largest, most connected, and technologically advanced island-wide tuition network.</p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Grid */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-blue-500/30 transition-colors group">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-blue-600 " />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Our Vision</h3>
            <p className="text-slate-800 font-medium leading-relaxed">
              To be the most trusted and technologically advanced educational platform in Sri Lanka, where every student has access to top-tier tuition regardless of their location.
            </p>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-blue-500/30 transition-colors group">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-blue-600 " />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Our Mission</h3>
            <p className="text-slate-800 font-medium leading-relaxed">
              To empower educators with smart digital tools to manage their classes, and to provide students with a seamless, AI-assisted platform to find, book, and engage in learning.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="px-6 py-20 bg-blue-50/50 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Comprehensive Platform Features</h2>
            <p className="text-slate-900 max-w-2xl mx-auto font-medium">
              Powered by a robust MERN stack architecture, our platform offers dedicated portals and advanced features tailored for every user type in the educational ecosystem.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <Users className="w-8 h-8 text-blue-500 mb-4" />
                <h4 className="text-lg font-medium text-slate-900 mb-2">Multi-Role Portals</h4>
                <p className="text-sm text-slate-800 ">Dedicated dashboards for Students to track progress, Teachers to manage classes, and Admins to oversee the entire platform.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <Map className="w-8 h-8 text-emerald-500 mb-4" />
                <h4 className="text-lg font-medium text-slate-900 mb-2">Smart Location Search</h4>
                <p className="text-sm text-slate-800 ">Integrated with Google Maps API, allowing students to effortlessly find physical classes nearest to their location, alongside online options.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <Bot className="w-8 h-8 text-purple-500 mb-4" />
                <h4 className="text-lg font-medium text-slate-900 mb-2">AI-Powered Assistance</h4>
                <p className="text-sm text-slate-800 ">Powered by Google Gemini AI, offering intelligent chatbot support, study recommendations, and automated content generation.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <CalendarCheck className="w-8 h-8 text-pink-500 mb-4" />
                <h4 className="text-lg font-medium text-slate-900 mb-2">Instant Reservations</h4>
                <p className="text-sm text-slate-800 ">A seamless booking system that tracks available seats in real-time, allowing students to reserve their spot with a single click.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <Shield className="w-8 h-8 text-amber-500 mb-4" />
                <h4 className="text-lg font-medium text-slate-900 mb-2">Secure Authentication</h4>
                <p className="text-sm text-slate-800 ">Enterprise-grade security using JWT and bcrypt, ensuring user data is protected across our MongoDB database.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <Bell className="w-8 h-8 text-sky-500 mb-4" />
                <h4 className="text-lg font-medium text-slate-900 mb-2">Real-time Notifications</h4>
                <p className="text-sm text-slate-800 ">Stay updated with instant alerts for class schedule changes, new review postings, and platform announcements.</p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
         <h2 className="text-3xl font-black text-slate-900 mb-6">Ready to start your journey?</h2>
         <div className="flex justify-center gap-4">
            <Link to="/register" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg transition-all">
              Join as a Student
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-slate-100 text-slate-900 font-medium rounded-xl hover:bg-slate-200 :bg-slate-700 transition-all">
              Contact Us
            </Link>
         </div>
      </section>

    </div>
  );
};

export default About;
