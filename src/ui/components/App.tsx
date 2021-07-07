// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';
import { CanvasContextProvider } from '../contexts';
import Sidebar from './Sidebar';
import { routes, Router } from '@ui/router';

export default function App(): JSX.Element {
  return (
    <CanvasContextProvider>
      {/* <DatabaseContextProvider> */}
      {/* className: dark | light */}
      <div className="dark">
        <div className="relative md:fixed flex min-h-screen inset-0 overflow-hidden dark:bg-gray-900">
          <Sidebar />
          <Router routes={routes} />
        </div>
      </div>
      {/* </DatabaseContextProvider> */}
    </CanvasContextProvider>
  );
}
