// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'eup7bh',
  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    baseUrl: 'http://127.0.0.1:8081/',
    testIsolation: false,
    async setupNodeEvents(on, config) {
      try {
        const task = await import('@cypress/code-coverage/task');
        task.default(on, config);
      } catch (err) {
        console.warn('[WARN] Code coverage task not loaded:', err?.message ?? err);
      }

      return config;
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
