// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';
import { hot } from 'react-hot-loader';
import { Sidebar } from './sidebar';
import { Router, routes } from './Router';
import { CanvasContextProvider, DatabaseContextProvider } from 'ui/contexts';
import { TransactionsContextProvider } from 'ui/contexts/TransactionsContext';

const App = (): JSX.Element => {
  return (
    <CanvasContextProvider>
      <DatabaseContextProvider>
        <div className="dark">
          <TransactionsContextProvider>
            <div className="relative md:fixed flex min-h-screen inset-0 overflow-hidden dark:bg-gray-900 dark:text-white text-black">
              <Sidebar />
              <Router routes={routes} />
            </div>
          </TransactionsContextProvider>
        </div>
      </DatabaseContextProvider>
    </CanvasContextProvider>
  );
};

export default hot(module)(App);
