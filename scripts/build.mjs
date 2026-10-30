
import { mkdir, copyFile } from 'node:fs/promises';

await mkdir('dist', { recursive: true });

await copyFile(
  'src/calculator.mjs',
  'dist/calculator.mjs'
);

console.log('Build completed successfully!');
