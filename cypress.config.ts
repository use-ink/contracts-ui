// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { defineConfig } from 'cypress';
import task from '@cypress/code-coverage/task';

export default defineConfig({
  projectId: 'eup7bh',

  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:8081/',
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
