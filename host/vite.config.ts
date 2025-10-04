import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        'crm-app': 'http://localhost:3001/assets/remoteEntry.js',
        'inventory-app': 'http://localhost:3002/assets/remoteEntry.js',
        'hr-app': 'http://localhost:3003/assets/remoteEntry.js',
        'finance-app': 'http://localhost:3004/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom', 'styled-components', 'zustand']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 3000,
    strictPort: true,
    cors: true
  },
  preview: {
    port: 3000,
    strictPort: true,
    cors: true,
    host: true
  }
});
