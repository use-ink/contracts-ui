// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';
import { Sidebar } from './Sidebar';
import { Router, routes } from './router';
import { CanvasContextProvider, DatabaseContextProvider } from 'ui/contexts';
// import { Database } from 'db';

export function App(): JSX.Element {
  return (
    <CanvasContextProvider>
      <DatabaseContextProvider>
        <div className="dark">
          <div className="relative md:fixed flex min-h-screen inset-0 overflow-hidden dark:bg-gray-900">
            <Sidebar />
            <Router routes={routes} />
          </div>
        </div>
      </DatabaseContextProvider>
    </CanvasContextProvider>
  );
}
