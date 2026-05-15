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

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Clean up any existing broken const API_URL lines
  content = content.replace(/const API_URL = .*?;\n/g, '');
  
  // Insert correct API_URL right after imports
  content = content.replace(/(import.*?\n)+/, match => match + '\nconst API_URL = process.env.NEXT_PUBLIC_API_URL || \'http://localhost:3000\';\n');
  
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}
