import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs-extra';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      writeBundle() {
        fs.copySync('public/site.webmanifest', 'dist/site.webmanifest');
      },
    },
  ],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'site.webmanifest') {
            return 'site.webmanifest';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
