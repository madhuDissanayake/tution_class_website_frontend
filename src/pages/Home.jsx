import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, ArrowRight, Star, Users, Video, MapPin, CheckCircle, ChevronDown, BadgeCheck } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const getSubjectImage = (subject) => {
  const subjectMap = {
    'Mathematics': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'English': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Physics': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Chemistry': 'https://images.unsplash.com/photo-1603126852883-ea2b6ee3c08a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Biology': 'https://images.unsplash.com/photo-1530213786676-41ce9f48a1b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Computer Science': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Business Studies': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Accounting': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Economics': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Sinhala': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'History': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Geography': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  };
  return subjectMap[subject] || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredTutors, setFeaturedTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [popularClasses, setPopularClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (user?.role === 'teacher') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchPopularClasses = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/classes?isPopular=true');
        setPopularClasses(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch popular classes", error);
      } finally {
        setLoadingClasses(false);
      }
    };
    
    fetchPopularClasses();
  }, []);

  useEffect(() => {
    const fetchFeaturedTutors = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/featured-tutors/public');
        setFeaturedTutors(data);
      } catch (error) {
        console.error("Failed to fetch featured tutors", error);
      } finally {
        setLoadingTutors(false);
      }
    };
    
    fetchFeaturedTutors();
  }, []);

  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-6 lg:pt-8 pb-16 px-6 lg:pb-24 bg-gradient-to-b from-indigo-50/40 via-white to-white">
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full relative z-10">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-[45%] space-y-6 lg:space-y-8 animate-fade-in z-10 text-center lg:text-left flex flex-col items-center lg:items-start">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 leading-[1.25] lg:leading-[1.3] tracking-tight">
              Find the Perfect <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-from to-brand-to font-extrabold">
                Tuition Class
              </span>
            </h1>

            <p className="text-base lg:text-lg text-slate-800 font-medium leading-loose max-w-lg">
              Find the perfect class, book your seat instantly, and start learning. Whether you prefer physical classrooms or online sessions, we have you covered.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link 
                to="/search" 
                className="w-full sm:w-auto bg-gradient-to-r from-brand-from to-brand-to text-white font-bold px-8 py-4 rounded-xl shadow-glow-primary hover:opacity-90 hover:-translate-y-[2px] transition-all duration-200 flex items-center justify-center group border border-slate-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Search className="w-5 h-5 mr-2" />
                <span>Find Classes Now</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4 text-slate-900/90 font-medium text-[13px]">
              <div className="flex items-center px-4 py-1.5 rounded-full bg-slate-900/5 border border-slate-900/10 backdrop-blur-sm shadow-sm transition-colors hover:bg-white/10">
                <CheckCircle className="w-4 h-4 mr-1.5 text-secondary"/> Verified Tutors
              </div>
              <div className="flex items-center px-4 py-1.5 rounded-full bg-slate-900/5 border border-slate-900/10 backdrop-blur-sm shadow-sm transition-colors hover:bg-white/10">
                <CheckCircle className="w-4 h-4 mr-1.5 text-secondary"/> Instant Booking
              </div>
              <div className="flex items-center px-4 py-1.5 rounded-full bg-slate-900/5 border border-slate-900/10 backdrop-blur-sm shadow-sm transition-colors hover:bg-white/10">
                <CheckCircle className="w-4 h-4 mr-1.5 text-secondary"/> Secure Platform
              </div>
            </div>


          </div>

          {/* Right Image/Illustration */}
          <div className="w-full lg:w-[45%] relative z-0 mt-12 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3]">
              {/* Main Image */}
              <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-card border-[6px] border-slate-100 relative z-10 group">
                <img 
                  src="/images/authentic_tuition.png" 
                  alt="Sri Lankan Students collaborating" 
                  onError={(e) => { e.target.src = getSubjectImage('default'); }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Background Decoration */}
              <div className="absolute -inset-4 border border-primary/20 rounded-[2.5rem] -z-10 transform rotate-3"></div>

              {/* Floating Stats Card: Students */}
              <div className="absolute -bottom-2 left-2 sm:-left-2 md:-bottom-4 md:-left-4 bg-slate-50/90 backdrop-blur-xl border border-slate-300 p-2 md:p-2.5 rounded-xl shadow-card z-20 flex items-center gap-2 animate-slide-up scale-75 md:scale-90 origin-bottom-left" style={{ animationDelay: '0.1s' }}>
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-1.5 md:p-2 rounded-lg shadow-inner text-slate-900">
                  <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-base md:text-lg font-black text-slate-900 leading-none">500+</h4>
                    <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1 py-0.5 rounded">4.8★</span>
                  </div>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-800 mt-0.5 uppercase tracking-wider">Active Students</p>
                </div>
              </div>

              {/* Floating Stats Card: Tutors */}
              <div className="absolute -top-2 right-2 sm:-right-2 md:-top-4 md:-right-4 bg-slate-50/90 backdrop-blur-xl border border-slate-300 p-2 md:p-2.5 rounded-xl shadow-card z-20 flex items-center gap-2 animate-slide-up scale-75 md:scale-90 origin-top-right" style={{ animationDelay: '0.3s' }}>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-slate-100 bg-primary/20 flex items-center justify-center text-primary-light"><Users className="w-3 h-3 md:w-3.5 md:h-3.5"/></div>
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-black text-slate-900 leading-none">50+</h4>
                  <p className="text-[8px] md:text-[9px] font-bold text-slate-800 mt-0.5 uppercase tracking-wider">Verified Tutors</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer animate-bounce z-20"
          onClick={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8 text-brand-to/70" />
        </div>
      </section>

      {/* Most Popular Classes Section */}
      <section className="py-20 px-6 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Most Popular Classes
              </h2>
              <p className="text-slate-800 font-medium">
                Explore the top-rated classes that students are loving right now.
              </p>
            </div>
            <Link to="/search" className="inline-flex items-center group font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-white px-2 py-1 -ml-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-from to-brand-to group-hover:opacity-80 transition-opacity">View All Classes</span>
              <ArrowRight className="w-4 h-4 ml-1 text-brand-to group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingClasses ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl overflow-hidden shadow-card border border-slate-300 animate-pulse">
                  <div className="h-32 bg-slate-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4 mt-1"></div>
                    <div className="h-3 bg-slate-200 rounded-md w-1/2 mb-4"></div>
                    <div className="pt-3 border-t border-slate-300 flex justify-between items-center mt-6">
                       <div className="h-4 bg-slate-200 rounded-md w-10"></div>
                       <div className="h-6 bg-slate-200 rounded-md w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : popularClasses.length === 0 ? (
               <div className="col-span-full text-center py-10 text-slate-900">More classes coming soon!</div>
            ) : (
              popularClasses.map(cls => (
                <Link key={cls._id} to={`/class/${cls._id}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 h-full">
                  <div className="h-48 relative overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src={cls.image || getSubjectImage(cls.subject)} 
                      alt={cls.title} 
                      onError={(e) => { e.target.src = getSubjectImage('default'); }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-80"></div>
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1.5 border border-white/50">
                      <BookOpen className="w-3 h-3 text-primary" /> {cls.medium}
                    </div>
                    <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm border ${cls.availableSeats > 0 ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-rose-500 text-white border-rose-400'}`}>
                      {cls.availableSeats > 0 ? `${cls.availableSeats} Seats Left` : 'Fully Booked'}
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-3">{cls.title}</h3>
                    <div className="flex items-center gap-2.5 mb-5 mt-auto">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center shrink-0">
                        {cls.teacherId?.profilePicture ? (
                          <img src={`${import.meta.env.VITE_API_URL}${cls.teacherId.profilePicture}`} alt={cls.teacherId.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-slate-700">
                            {cls.teacherId?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-slate-600 truncate">By {cls.teacherId?.name || 'Unknown Teacher'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-black text-slate-800">
                          {cls.avgRating ? cls.avgRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Per Month</span>
                        <span className="text-lg font-black text-primary">Rs. {cls.fee}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col text-center items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Meet Our Featured Tutors
            </h2>
            <p className="text-slate-800 font-medium max-w-2xl">
              Learn from the best. Our top-rated tutors are here to guide you to academic excellence.
            </p>
          </div>

          <div className={`gap-4 md:gap-5 ${featuredTutors.length < 4 ? 'flex flex-wrap justify-center' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'}`}>
            {loadingTutors ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl p-6 shadow-card border border-slate-300 flex flex-col items-center text-center animate-pulse w-full max-w-[200px] mx-auto shrink-0">
                  <div className="w-16 h-16 rounded-full bg-slate-200 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-3"></div>
                  <div className="h-2 bg-slate-200 rounded-md w-1/2 mb-6"></div>
                  <div className="flex justify-center w-full pt-4 border-t border-slate-300">
                    <div className="h-3 bg-slate-200 rounded-md w-2/3"></div>
                  </div>
                </div>
              ))
            ) : featuredTutors.length === 0 ? (
               <div className="col-span-full text-center py-10 text-slate-900">No featured tutors available at the moment.</div>
            ) : (
              featuredTutors.map(tutor => {
                const colorMap = {
                  indigo: 'from-indigo-500 to-blue-600',
                  pink: 'from-pink-500 to-rose-500',
                  emerald: 'from-emerald-500 to-teal-500',
                  blue: 'from-blue-500 to-cyan-500',
                  purple: 'from-purple-500 to-indigo-500',
                  rose: 'from-rose-500 to-orange-500',
                  teal: 'from-teal-500 to-emerald-500',
                  cyan: 'from-cyan-500 to-blue-500',
                };
                const bgGradient = colorMap[tutor.themeColor] || 'from-primary to-primary-light';

                return (
                  <Link to={`/search?q=${encodeURIComponent(tutor.name)}`} key={tutor._id} className="group relative bg-slate-100 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 border border-slate-300 flex flex-col items-center w-full max-w-[200px] mx-auto shrink-0">
                    {/* Top Banner */}
                    <div className={`w-full h-16 bg-gradient-to-r ${bgGradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500 relative`}>
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
                    </div>
                    
                    {/* Overlapping Avatar with Verified Badge */}
                    <div className="relative -mt-8 z-10 group-hover:scale-110 transition-transform duration-500">
                      <div className="w-16 h-16 rounded-full border-4 border-slate-100 bg-slate-50 flex items-center justify-center text-2xl font-black shadow-xl overflow-hidden">
                        {tutor.profilePicture ? (
                          <img src={`${import.meta.env.VITE_API_URL}${tutor.profilePicture}`} alt={tutor.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className={`text-transparent bg-clip-text bg-gradient-to-br ${bgGradient}`}>
                            {tutor.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {/* Verified Badge */}
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center">
                        <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                      </div>
                    </div>
                    
                    <div className="p-4 w-full flex flex-col items-center">
                      <h3 className="text-base font-bold text-slate-900 mb-0.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-surface-300 transition-colors line-clamp-1">{tutor.name}</h3>
                      <p className="text-[10px] text-slate-800 font-medium mb-3">{tutor.subject} Tutor</p>
                      
                      <div className="flex items-center justify-between w-full pt-3 border-t border-slate-200/50">
                        <div className="flex flex-col items-center w-[45%]">
                          <div className="flex items-center mb-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                            <span className="text-sm font-black text-slate-900 leading-none">{tutor.rating ? tutor.rating.toFixed(1) : '5.0'}</span>
                          </div>
                          <span className="text-[8px] text-slate-900 font-semibold uppercase tracking-wider">Rating</span>
                        </div>
                        
                        <div className="w-px h-4 bg-slate-200/80"></div>
                        
                        <div className="flex flex-col items-center w-[45%]">
                          <div className="flex items-center mb-0.5">
                            <Users className="w-3 h-3 text-sky-400 mr-1" />
                            <span className="text-sm font-black text-slate-900 leading-none">{tutor.studentsCount}</span>
                          </div>
                          <span className="text-[8px] text-slate-900 font-semibold uppercase tracking-wider">Students</span>
                        </div>
                      </div>

                      {/* View Class CTA */}
                      <div className="w-full mt-4 pt-3 border-t border-slate-200/50">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-light group-hover:text-slate-900 transition-colors">
                          View Class <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Interactive Classes Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Physical & Online Classes, <br/>All in One Place
              </h2>
              <p className="text-lg text-slate-800 font-medium">
                Our platform streamlines your learning journey. Easily find nearby physical classes or enroll in high-quality virtual sessions from the comfort of your home.
              </p>
              
              <ul className="space-y-4 pt-2">
                <li className="flex items-start">
                  <div className="mt-1 bg-primary-dark/30 p-2 rounded-lg text-primary-light mr-4 shadow-sm border border-primary-dark/50">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Location-based Classes</h4>
                    <p className="text-sm text-slate-800 mt-1 leading-relaxed">Find nearby physical classes and tutors conducting sessions in your area easily.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 bg-primary-dark/30 p-2 rounded-lg text-primary-light mr-4 shadow-sm border border-primary-dark/50">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Find Your Best Fit</h4>
                    <p className="text-sm text-slate-800 mt-1 leading-relaxed">Search for physical and online classes to suit your personal preferences perfectly.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 bg-primary-dark/30 p-2 rounded-lg text-primary-light mr-4 shadow-sm border border-primary-dark/50">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Details & Instant Booking</h4>
                    <p className="text-sm text-slate-800 mt-1 leading-relaxed">View teachers, class times, and monthly fees. Book available seats instantly.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-card border border-slate-300 relative">
                <img 
                  src="/images/srilankan_student_studying.png" 
                  alt="Sri Lankan Students studying" 
                  onError={(e) => { e.target.src = getSubjectImage('default'); }}
                  className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent flex flex-col justify-end p-8 pointer-events-none">
                  <h3 className="text-slate-900 text-2xl font-bold">Seamless Learning Experience</h3>
                  <p className="text-slate-800 mt-2 font-medium">Empowering students with modern educational tools.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
