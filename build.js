import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  console.log('Building...');
  execSync('vite build', { stdio: 'inherit', cwd: __dirname });
  
  console.log('Copying vercel.json to dist...');
  if (!existsSync('dist')) {
    mkdirSync('dist');
  }
  copyFileSync('vercel.json', 'dist/vercel.json');
  console.log('Build complete!');
} catch (e) {
  console.error('Build failed:', e);
  process.exit(1);
}
