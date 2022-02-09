// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Outlet } from 'react-router';
import { AwaitApis } from 'ui/components/AwaitApis';
import { Sidebar } from 'ui/components/sidebar';

import {
  ApiContextProvider,
  DatabaseContextProvider,
  TransactionsContextProvider,
} from 'ui/contexts';

const App = (): JSX.Element => {
  return (
    <ApiContextProvider>
      <DatabaseContextProvider>
        <div className="dark">
          <TransactionsContextProvider>
            <div className="relative md:fixed flex min-h-screen inset-0 overflow-hidden dark:bg-gray-900 dark:text-white text-black">
              <Sidebar />
              <AwaitApis>
                <Outlet />
              </AwaitApis>
            </div>
          </TransactionsContextProvider>
        </div>
      </DatabaseContextProvider>
    </ApiContextProvider>
  );
};

export default App;
