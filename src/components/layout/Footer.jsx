import { Mail, Phone, MapPin, Sparkles, ArrowUp, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0B1120] text-slate-300 pt-20 pb-8 mt-auto overflow-hidden border-t border-slate-800/60">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          <div className="lg:col-span-4 space-y-6 pr-0 lg:pr-8">
            <Link to="/" className="flex items-center space-x-3 group w-fit">
              <div className="relative group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                <Logo className="dark:bg-transparent bg-transparent" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center">
                Tuition
                <span className="text-blue-500 ml-1">Hub</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering ambitious learners across Sri Lanka by bridging the gap with elite educators. Discover expert tutors, book classes instantly, and elevate your learning.
            </p>
            
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="group relative p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]" aria-label="Facebook">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="h-4 w-4 fill-slate-400 group-hover:fill-white relative z-10 transition-colors" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a href="#" className="group relative p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-sky-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]" aria-label="Twitter">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="h-4 w-4 fill-slate-400 group-hover:fill-white relative z-10 transition-colors" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="group relative p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]" aria-label="LinkedIn">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="h-4 w-4 fill-slate-400 group-hover:fill-white relative z-10 transition-colors" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6 space-y-5">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest flex items-center mb-6">
              <span className="w-2 h-2 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-full mr-3 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></span>
              Explore
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/" onClick={scrollToTop} className="text-slate-400 hover:text-blue-400 transition-all duration-300 flex items-center group"><span className="w-0 group-hover:w-2 h-px bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>Home</Link></li>
              <li><Link to="/search" onClick={scrollToTop} className="text-slate-400 hover:text-blue-400 transition-all duration-300 flex items-center group"><span className="w-0 group-hover:w-2 h-px bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>Classes</Link></li>
              <li><Link to="/about" onClick={scrollToTop} className="text-slate-400 hover:text-blue-400 transition-all duration-300 flex items-center group"><span className="w-0 group-hover:w-2 h-px bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>About Us</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="text-slate-400 hover:text-blue-400 transition-all duration-300 flex items-center group"><span className="w-0 group-hover:w-2 h-px bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 lg:col-start-8 space-y-5">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest flex items-center mb-6">
              <span className="w-2 h-2 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mr-3 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
              Resources
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/dashboard" onClick={scrollToTop} className="text-slate-400 hover:text-purple-400 transition-all duration-300 flex items-center group"><span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>Student Portal</Link></li>
              <li><Link to="/dashboard" onClick={scrollToTop} className="text-slate-400 hover:text-purple-400 transition-all duration-300 flex items-center group"><span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>Tutor Dashboard</Link></li>
              <li><Link to="/register" onClick={scrollToTop} className="text-slate-400 hover:text-purple-400 transition-all duration-300 flex items-center group"><span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>Become a Tutor</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="text-slate-400 hover:text-purple-400 transition-all duration-300 flex items-center group"><span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>Help Center</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-10 space-y-5">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest flex items-center mb-6">
              <span className="w-2 h-2 bg-gradient-to-tr from-sky-500 to-blue-500 rounded-full mr-3 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></span>
              Support
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start space-x-3 text-slate-400 group">
                <div className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-blue-500/10 transition-colors">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <span className="mt-1">Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 group">
                <div className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-blue-500/10 transition-colors">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <a href="tel:+94779803887" className="hover:text-white transition-colors">+94 77 980 3887</a>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 group">
                <div className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-blue-500/10 transition-colors">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <a href="mailto:tuitionhub0011@gmail.com" className="hover:text-white transition-colors">tuitionhub0011@gmail.com</a>
              </li>
            </ul>
          </div>


        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium">
          <p className="text-slate-500 text-center md:text-left order-2 md:order-1 flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-bold">TuitionHub</span>. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-500 order-1 md:order-2">
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Cookies</span>
            
            <button 
              onClick={scrollToTop} 
              className="ml-4 p-2.5 bg-slate-800/80 hover:bg-gradient-to-tr hover:from-blue-600 hover:to-indigo-600 hover:text-white rounded-xl text-slate-400 border border-slate-700 hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-black/20"
              title="Back to Top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
