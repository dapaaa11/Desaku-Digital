const fs = require('fs');
const files = [
  'frontend/app/users/page.tsx',
  'frontend/app/umkm/page.tsx',
  'frontend/app/surat/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('const API_URL')) {
    content = content.replace('export default function', 'const API_URL = process.env.NEXT_PUBLIC_API_URL || \'http://localhost:3000\';\n\nexport default function');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
