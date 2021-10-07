// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Sidebar } from './sidebar';
import { Router, routes } from './Router';
import { ApiContextProvider, DatabaseContextProvider } from 'ui/contexts';
// import { Database } from '@db';

export function App(): JSX.Element {
  return (
    <ApiContextProvider>
      <DatabaseContextProvider>
        <div className="dark">
          <div className="relative md:fixed flex min-h-screen inset-0 overflow-hidden dark:bg-gray-900 dark:text-white text-black">
            <Sidebar />
            <Router routes={routes} />
          </div>
        </div>
      </DatabaseContextProvider>
    </ApiContextProvider>
  );
}
