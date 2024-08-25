// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { defineConfig } from 'cypress';
import task from '@cypress/code-coverage/task';

export default defineConfig({
  projectId: 'eup7bh',
  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    baseUrl: 'http://127.0.0.1:3000/',
    testIsolation: false,
    setupNodeEvents(on, config) {
      task(on, config);
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
