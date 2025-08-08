const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
const notFoundPath = path.join(__dirname, '..', 'dist', '404.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log(' 404.html created');
} else {
  console.error('index.html not found. Build the project first.');
  process.exit(1);
}