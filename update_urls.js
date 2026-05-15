const fs = require('fs');
const files = [
  'frontend/app/gallery/page.tsx',
  'frontend/app/users/page.tsx',
  'frontend/app/village-profile/page.tsx',
  'frontend/app/umkm/page.tsx',
  'frontend/app/page.tsx',
  'frontend/app/surat/page.tsx',
  'frontend/app/dashboard/page.tsx'
];

const API_CONST = 'const API_URL = process.env.NEXT_PUBLIC_API_URL || \'http://localhost:3000\';\n';

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('API_URL = process.env.NEXT_PUBLIC_API_URL')) {
    // Add API_CONST after imports
    content = content.replace(/(import.*?\n)+(?=\n|(?!\nimport))/, match => match + '\n' + API_CONST);
  }
  
  // Replace direct strings
  content = content.replace(/\"http:\/\/localhost:3000(.*?)\"/g, '\`${API_URL}$1\`');
  
  // Replace inside template literals: `http://localhost:3000/users/${id}` -> `${API_URL}/users/${id}`
  content = content.replace(/http:\/\/localhost:3000/g, '${API_URL}');
  
  fs.writeFileSync(file, content);
  console.log('Updated', file);
}
