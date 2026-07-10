const fs = require('fs');

const files = [
  'c:/projects/Project/frontend/src/pages/EditClass.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  // Background blobs
  content = content.replace(/bg-blue-500\/10/g, 'bg-primary/10');
  content = content.replace(/bg-purple-500\/10/g, 'bg-primary/10');
  
  // Titles
  content = content.replace(/text-3xl font-semibold text-white drop-shadow-md mb-8/g, 'text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary tracking-tight mb-8');
  content = content.replace(/text-slate-900 dark:text-white/g, 'text-white');
  content = content.replace(/text-slate-900/g, 'text-white');
  
  // Containers
  content = content.replace(/bg-white p-8 rounded-2xl shadow-xl border border-gray-100/g, 'glass-panel bg-surface-900/80 p-8 rounded-3xl shadow-card border border-surface-700 relative z-10');
  
  // Input labels
  content = content.replace(/text-gray-700/g, 'text-muted-400');
  
  // Input fields
  const oldInputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white bg-white placeholder-slate-400 font-semibold';
  const newInputClass = 'w-full px-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white bg-surface-800 placeholder-muted-500 transition-all font-semibold';
  content = content.split(oldInputClass).join(newInputClass);

  // Textarea
  const oldTextareaClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none text-white bg-white placeholder-slate-400 font-semibold';
  const newTextareaClass = 'w-full px-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none text-white bg-surface-800 placeholder-muted-500 font-semibold';
  content = content.split(oldTextareaClass).join(newTextareaClass);

  // Checkbox
  content = content.replace(/text-primary border-gray-300 rounded focus:ring-primary/g, 'text-primary border-surface-600 bg-surface-800 rounded focus:ring-primary/50');
  
  // Muted text
  content = content.replace(/text-gray-500/g, 'text-muted-500');

  // Borders
  content = content.replace(/border-slate-100/g, 'border-surface-700');
  content = content.replace(/border-gray-100/g, 'border-surface-700');
  content = content.replace(/border-gray-300/g, 'border-surface-600');

  // Add Schedule Button
  content = content.replace(/bg-indigo-50 hover:bg-primary hover:text-white text-primary font-medium py-2 px-4 rounded-lg transition-colors border border-indigo-100/g, 'bg-primary/10 hover:bg-primary text-primary-light hover:text-white font-medium py-2 px-4 rounded-lg transition-colors border border-primary/20');
  
  // Schedule Rows Container
  content = content.replace(/bg-slate-50 p-3 rounded-lg border border-surface-700/g, 'bg-surface-800/50 p-3 rounded-lg border border-surface-600');
  
  // Schedule inputs
  const oldScheduleInputClass = 'w-full px-3 py-2 border border-surface-600 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary text-white font-semibold';
  const newScheduleInputClass = 'w-full px-3 py-2 border border-surface-600 rounded-lg bg-surface-900 outline-none focus:ring-2 focus:ring-primary/20 text-white font-semibold';
  content = content.split(oldScheduleInputClass).join(newScheduleInputClass);
  
  // Remove button in schedule
  content = content.replace(/hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100/g, 'hover:bg-red-500/10 p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/20 text-red-400');

  // Cancel Button
  content = content.replace(/px-6 py-2 border border-surface-600 text-muted-400 rounded-lg hover:bg-slate-50 transition-colors/g, 'px-6 py-2 border border-surface-600 text-muted-400 rounded-lg hover:text-white hover:bg-surface-700 transition-colors');
  
  // Submit Button
  content = content.replace(/px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors shadow flex items-center/g, 'px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-glow-primary hover:-translate-y-0.5 flex items-center');

  // Error block
  content = content.replace(/bg-red-50 text-red-700 p-4 rounded-xl border border-red-200/g, 'bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20');
  content = content.replace(/text-red-700 hover:text-red-900/g, 'text-red-400 hover:text-red-300');

  // Loading container
  content = content.replace(/flex justify-center items-center h-64/g, 'flex justify-center items-center min-h-[50vh]');

  // Fix up specific texts
  content = content.replace(/text-gray-900/g, 'text-white');
  content = content.replace(/text-gray-600/g, 'text-muted-400');
  
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
