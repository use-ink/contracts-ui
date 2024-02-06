// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsConfigPaths from 'vite-tsconfig-paths';
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'cypress/'],
      cypress: true,
    }),
  ],
  server: { port: 8081 },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        dir: './dist',
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](react|react-dom)[\\/]/.test(id)) {
            return 'react';
          }

          if (/[\\/]node_modules[\\/](@polkadot)[\\/]/.test(id)) {
            return 'polkadot';
          }
        },
      },
    },
  },
});
