// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Outlet } from 'react-router';
import { Notifications } from './Notifications';
import { Transactions } from './Transactions';
import { Sidebar, AwaitApis } from 'ui/components';
import {
  ApiContextProvider,
  DatabaseContextProvider,
  NotificationsContextProvider,
  ThemeContextProvider,
  TransactionsContextProvider,
} from 'ui/contexts';

const App = (): JSX.Element => {
  return (
    <ThemeContextProvider>
      <ApiContextProvider>
        <DatabaseContextProvider>
          <TransactionsContextProvider>
            <NotificationsContextProvider>
              <div className="relative md:fixed flex min-h-screen inset-0 overflow-hidden dark:bg-gray-900 dark:text-white text-black">
                <div className="z-10 fixed right-3 top-3 w-80 last:mb-0">
                  <Notifications />
                  <Transactions />
                </div>
                <Sidebar />
                <AwaitApis>
                  <Outlet />
                </AwaitApis>
              </div>
            </NotificationsContextProvider>
          </TransactionsContextProvider>
        </DatabaseContextProvider>
      </ApiContextProvider>
    </ThemeContextProvider>
  );
};

export default App;
