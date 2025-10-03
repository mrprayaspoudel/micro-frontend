import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    federation({
      name: 'hr-app',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
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
    port: 3003,
    strictPort: true,
    cors: true
  },
  preview: {
    port: 3003,
    strictPort: true,
    cors: true
  }
});
