const Logo = ({ className = "", iconOnly = false }) => {
  const SvgContent = (
    <svg viewBox="0 0 24 24" fill="none" className={iconOnly ? (className || "w-5 h-5") : "w-7 h-7"} xmlns="http://www.w3.org/2000/svg">
      {/* Animated floating top diamond (Graduation cap) */}
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#logo-grad-top)" className="animate-float" />
      
      {/* Bottom structure (Book/Base) */}
      <path d="M4 9.5V14.5C4 16.5 7.5 19 12 19C16.5 19 20 16.5 20 14.5V9.5L12 13.5L4 9.5Z" fill="url(#logo-grad-bottom)" />
      
      {/* Inner spark/atom */}
      <circle cx="12" cy="14" r="1.5" fill="#FFF" className="animate-pulse" />
      
      <defs>
        <linearGradient id="logo-grad-top" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC4899" /> {/* Pink */}
          <stop offset="1" stopColor="#8B5CF6" /> {/* Purple */}
        </linearGradient>
        <linearGradient id="logo-grad-bottom" x1="4" y1="9.5" x2="20" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" /> {/* Purple */}
          <stop offset="1" stopColor="#6366F1" /> {/* Indigo */}
        </linearGradient>
      </defs>
    </svg>
  );

  if (iconOnly) {
    return SvgContent;
  }

  return (
    <div className={`relative flex items-center justify-center shrink-0 w-11 h-11 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-500/20 ${className}`}>
       {SvgContent}
    </div>
  );
};

export default Logo;
