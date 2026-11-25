import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Immediately copy the QR code image on config load
const srcPath = 'C:\\Users\\dhay6\\.gemini\\antigravity\\brain\\44e746c0-5ced-47ae-aba0-ad82e2a09874\\media__1783415779229.png';
const destPath = path.resolve('public/google-review-qr.png');

try {
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log('Successfully copied Google Review QR code directly on config load.');
  } else {
    console.warn('Source QR code file not found at:', srcPath);
  }
} catch (err) {
  console.error('Error copying QR code on load:', err);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
