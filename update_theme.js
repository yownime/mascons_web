const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const replacements = [
        // Remove dark mode classes
        [/dark:bg-slate-\w+(\/\d+)?/g, ''],
        [/dark:border-slate-\w+(\/\d+)?/g, ''],
        [/dark:text-slate-\w+(\/\d+)?/g, ''],
        [/dark:hover:bg-slate-\w+(\/\d+)?/g, ''],
        [/dark:hover:bg-indigo-\w+(\/\d+)?/g, ''],
        [/dark:hover:border-indigo-\w+(\/\d+)?/g, ''],
        [/dark:hover:text-indigo-\w+(\/\d+)?/g, ''],
        [/dark:text-indigo-\w+(\/\d+)?/g, ''],
        [/dark:divide-slate-\w+(\/\d+)?/g, ''],
        [/dark:bg-amber-\w+(\/\d+)?/g, ''],
        [/dark:text-amber-\w+(\/\d+)?/g, ''],
        [/dark:bg-emerald-\w+(\/\d+)?/g, ''],
        [/dark:text-emerald-\w+(\/\d+)?/g, ''],
        [/dark:bg-red-\w+(\/\d+)?/g, ''],
        [/dark:text-red-\w+(\/\d+)?/g, ''],
        [/dark:border-red-\w+(\/\d+)?/g, ''],
        [/dark:shadow-\w+/g, ''],
        [/dark:border-indigo-\w+(\/\d+)?/g, ''],
        
        // Replace slate with purple
        [/bg-slate-50/g, 'bg-purple-50'],
        [/bg-slate-100/g, 'bg-purple-100'],
        [/bg-slate-800/g, 'bg-purple-800'],
        [/bg-slate-700/g, 'bg-purple-700'],
        [/text-slate-800/g, 'text-purple-950'],
        [/text-slate-700/g, 'text-purple-900'],
        [/text-slate-600/g, 'text-purple-900'],
        [/text-slate-500/g, 'text-purple-800/70'],
        [/text-slate-400/g, 'text-purple-400'],
        [/text-slate-300/g, 'text-purple-300'],
        [/border-slate-200/g, 'border-purple-100'],
        [/border-slate-300/g, 'border-purple-200'],
        [/divide-slate-100/g, 'divide-purple-100'],
        [/shadow-slate-\w+/g, 'shadow-purple-200'],
        
        // Replace indigo with purple accents
        [/text-indigo-600/g, 'text-purple-700'],
        [/text-indigo-500/g, 'text-purple-600'],
        [/bg-indigo-100/g, 'bg-purple-100'],
        [/bg-indigo-50/g, 'bg-purple-50'],
        [/hover:bg-indigo-50/g, 'hover:bg-purple-50'],
        [/hover:text-indigo-600/g, 'hover:text-purple-700'],
        [/hover:text-indigo-500/g, 'hover:text-purple-600'],
        [/group-hover:text-indigo-500/g, 'group-hover:text-purple-600'],
        [/hover:border-indigo-500/g, 'hover:border-purple-400'],
      ];

      for (const [pattern, replacement] of replacements) {
        content = content.replace(pattern, replacement);
      }

      fs.writeFileSync(fullPath, content);
      console.log('Updated ' + fullPath);
    }
  }
}

processDir(path.join(process.cwd(), 'app', 'admin'));
