const fs = require('fs');

const file = 'c:/projects/Project/frontend/src/pages/AdminPanel.jsx';

if (!fs.existsSync(file)) {
  console.log('File not found');
  process.exit(1);
}

let content = fs.readFileSync(file, 'utf8');

// Background blobs
content = content.replace(/bg-blue-500\/10/g, 'bg-primary/10');
content = content.replace(/bg-purple-500\/10/g, 'bg-primary/10');

// Titles
content = content.replace(/text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight/g, 'text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary tracking-tight');
content = content.replace(/text-slate-900 dark:text-white/g, 'text-white');
content = content.replace(/text-gray-900/g, 'text-white');

// Panels & Containers
content = content.replace(/bg-white dark:bg-slate-800\/50 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700/g, 'glass-panel bg-surface-900/80 p-6 rounded-3xl shadow-card border border-surface-700 relative z-10');
content = content.replace(/bg-white dark:bg-slate-800\/50 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden/g, 'glass-panel bg-surface-900/80 rounded-3xl shadow-card border border-surface-700 overflow-hidden relative z-10');
content = content.replace(/bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 p-6/g, 'glass-panel bg-surface-900/80 rounded-3xl shadow-card border border-surface-700 p-6 relative z-10');
content = content.replace(/bg-slate-50 dark:bg-slate-800\/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/g, 'bg-surface-800/50 p-4 rounded-2xl border border-surface-600');
content = content.replace(/bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/g, 'bg-surface-800/50 p-4 rounded-xl border border-surface-600');

// Text colors
content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-muted-400');
content = content.replace(/text-slate-500/g, 'text-muted-500');
content = content.replace(/text-gray-500/g, 'text-muted-500');

// Tables
content = content.replace(/bg-slate-50 dark:bg-slate-900\/50 border-b border-slate-200 dark:border-slate-700/g, 'bg-surface-800 border-b border-surface-700');
content = content.replace(/hover:bg-slate-50 dark:hover:bg-slate-800\/50 transition-colors/g, 'hover:bg-surface-800/50 transition-colors');
content = content.replace(/divide-y divide-slate-100 dark:divide-slate-800/g, 'divide-y divide-surface-700/50');
content = content.replace(/border-slate-200 dark:border-slate-700/g, 'border-surface-600');
content = content.replace(/border-slate-100/g, 'border-surface-700');

// Status Pills (Approved/Pending/Cancelled)
content = content.replace(/bg-emerald-100 text-emerald-800 border-emerald-200/g, 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20');
content = content.replace(/bg-amber-100 text-amber-800 border-amber-200/g, 'bg-amber-500/10 text-amber-400 border-amber-500/20');
content = content.replace(/bg-emerald-100 text-emerald-700 border-emerald-200/g, 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20');
content = content.replace(/bg-amber-100 text-amber-700 border-amber-200/g, 'bg-amber-500/10 text-amber-400 border-amber-500/20');
content = content.replace(/bg-slate-100 text-slate-800 border-slate-200/g, 'bg-surface-800 text-muted-400 border-surface-600');

// Buttons
content = content.replace(/bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm/g, 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20');
content = content.replace(/bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/g, 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20');
content = content.replace(/bg-indigo-50 hover:bg-primary text-primary hover:text-white border border-indigo-100/g, 'bg-primary/10 hover:bg-primary text-primary-light hover:text-white border border-primary/20');
content = content.replace(/bg-primary text-white rounded-xl hover:bg-indigo-700 transition-colors shadow flex/g, 'bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-glow-primary hover:-translate-y-0.5 flex');

// Success / Error alerts
content = content.replace(/bg-green-50 text-green-700 p-4 rounded-xl border border-green-200/g, 'bg-emerald-500/10 text-emerald-400 p-4 rounded-xl border border-emerald-500/20 relative z-10');
content = content.replace(/text-green-700 hover:text-green-900/g, 'text-emerald-400 hover:text-emerald-300');
content = content.replace(/bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-200/g, 'bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 relative z-10');
content = content.replace(/text-rose-700 hover:text-rose-900/g, 'text-red-400 hover:text-red-300');

// Dashboard Stat Cards Icons
content = content.replace(/bg-blue-100 dark:bg-blue-900\/50 text-blue-600 dark:text-blue-400/g, 'bg-primary/20 text-primary-light');
content = content.replace(/bg-purple-100 dark:bg-purple-900\/50 text-purple-600 dark:text-purple-400/g, 'bg-primary/20 text-primary-light');
content = content.replace(/bg-emerald-100 dark:bg-emerald-900\/50 text-emerald-600 dark:text-emerald-400/g, 'bg-emerald-500/20 text-emerald-400');

// Inputs
const oldInputClass = 'w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold';
const newInputClass = 'w-full px-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white bg-surface-800 placeholder-muted-500 transition-all font-semibold';
content = content.split(oldInputClass).join(newInputClass);

fs.writeFileSync(file, content);
console.log(`Updated ${file}`);
