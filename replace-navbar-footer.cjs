const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'c:/projects/Project/frontend/src/components/layout/Navbar.jsx',
  'c:/projects/Project/frontend/src/components/layout/Footer.jsx'
];

filesToUpdate.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  // Surface colors
  content = content.replace(/bg-white\/90 dark:bg-slate-900\/90/g, 'bg-surface-950/90');
  content = content.replace(/bg-white\/50 dark:bg-slate-900\/50/g, 'bg-surface-950/50');
  content = content.replace(/bg-white\/95 dark:bg-slate-900\/95/g, 'bg-surface-950/95');
  content = content.replace(/border-slate-200 dark:border-slate-800/g, 'border-surface-700');
  content = content.replace(/dark:shadow-\[0_2px_10px_rgba\(0,0,0,0\.2\)\]/g, '');
  content = content.replace(/dark:border-white\/10/g, 'border-white/10');
  content = content.replace(/text-slate-900 dark:text-white/g, 'text-white');
  
  // Blue to Primary
  content = content.replace(/text-blue-600 dark:text-blue-400/g, 'text-primary-light');
  content = content.replace(/text-blue-700 dark:text-blue-300/g, 'text-primary-light');
  content = content.replace(/text-blue-600/g, 'text-primary');
  content = content.replace(/bg-blue-600\/50 dark:after:bg-blue-400\/50/g, 'bg-primary/50');
  content = content.replace(/bg-blue-600/g, 'bg-primary');
  content = content.replace(/hover:bg-blue-700/g, 'hover:bg-primary-dark');
  content = content.replace(/hover:text-blue-600 dark:hover:text-blue-400/g, 'hover:text-primary-light');
  content = content.replace(/hover:bg-blue-100 dark:hover:bg-blue-900\/50/g, 'hover:bg-primary/20');
  content = content.replace(/bg-blue-50 dark:bg-blue-900\/30/g, 'bg-primary/10');
  content = content.replace(/bg-blue-100/g, 'bg-primary/20');
  content = content.replace(/border-blue-100 dark:border-blue-800/g, 'border-primary/20');

  // Emerald to secondary
  content = content.replace(/text-emerald-700 dark:text-emerald-300/g, 'text-secondary-light');
  content = content.replace(/bg-emerald-50 dark:bg-emerald-900\/30/g, 'bg-secondary/10');
  content = content.replace(/hover:bg-emerald-100 dark:hover:bg-emerald-900\/50/g, 'hover:bg-secondary/20');

  // Text
  content = content.replace(/text-slate-600 dark:text-slate-400/g, 'text-muted-400');
  content = content.replace(/text-slate-500/g, 'text-muted-500');
  content = content.replace(/text-slate-700 dark:text-slate-200/g, 'text-white');
  content = content.replace(/text-slate-400/g, 'text-muted-400');
  content = content.replace(/text-slate-600/g, 'text-muted-400');
  content = content.replace(/text-slate-700 dark:text-slate-300/g, 'text-muted-400');
  
  // Backgrounds & Borders
  content = content.replace(/bg-slate-100 dark:bg-slate-800/g, 'bg-surface-800');
  content = content.replace(/border-slate-200 dark:border-slate-700/g, 'border-surface-600');
  content = content.replace(/hover:bg-slate-200 dark:hover:bg-slate-700/g, 'hover:bg-surface-700');
  content = content.replace(/bg-slate-900/g, 'bg-surface-950');

  // Hover states
  content = content.replace(/hover:bg-slate-50 dark:hover:bg-slate-800/g, 'hover:bg-surface-800');
  
  // Footer specifically
  content = content.replace(/bg-slate-50 dark:bg-slate-900/g, 'bg-surface-950');
  content = content.replace(/text-slate-800 dark:text-white/g, 'text-white');

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
