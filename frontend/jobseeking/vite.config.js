import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './public/manifest.json'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: manifest,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,png}']
      }
    })
  ],
  build: {
    outDir: 'dist', // This is the folder where the production build will be generated
  },
});
