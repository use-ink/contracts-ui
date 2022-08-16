// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    eslintPlugin(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'cypress/'],
      cypress: true,
    }),
  ],
  server: { port: 8081 },
  build: {
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
