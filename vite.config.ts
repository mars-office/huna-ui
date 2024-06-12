/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,mjs,css,html,ico,png,svg,ttf,otf,woff,woff2,jsx,tsx,ts,json,dll,jpg,jpeg,gif,bmp,webp,webm,tiff,avi,mp4,mp3,aac}'],
        navigateFallbackDenylist: [/^\/api/],
        importScripts: ['/service-worker/push.js'],
        clientsClaim: true,
      },
      manifest: {
        name: 'huna2',
        short_name: 'huna',
        description: 'huna2',
        theme_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/images/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/images/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true,
      }
    }),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api/opa/v1/data/com/huna/public_authz': {
        target: 'http://localhost:8181',
        rewrite: p => p.replace('/api/opa/', '/')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 2048,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
