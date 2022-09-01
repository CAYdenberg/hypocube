/* eslint-disable */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: path.join(__dirname),
  plugins: [react()],
  server: {
    port: 8080,
  },
  build: {
    emptyOutDir: true,
    outDir: path.join(__dirname, 'dist'),
    lib: {
      entry: path.join(__dirname, './src/index.ts'),
      name: 'hypocube',
      fileName: (format) => `hypocube.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
});
