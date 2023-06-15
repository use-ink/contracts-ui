// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Outlet } from 'react-router';
import { Sidebar, AwaitApis } from 'ui/components';
import {
  ApiContextProvider,
  DatabaseContextProvider,
  TransactionsContextProvider,
  ThemeContextProvider,
} from 'ui/contexts';

const App = (): JSX.Element => {
  return (
    <ThemeContextProvider>
      <ApiContextProvider>
        <DatabaseContextProvider>
          <TransactionsContextProvider>
            <div className="relative inset-0 flex min-h-screen flex-col overflow-hidden text-black dark:bg-gray-900 dark:text-white md:fixed md:flex-row">
              <Sidebar />
              <AwaitApis>
                <Outlet />
              </AwaitApis>
            </div>
          </TransactionsContextProvider>
        </DatabaseContextProvider>
      </ApiContextProvider>
    </ThemeContextProvider>
  );
};

export default App;
