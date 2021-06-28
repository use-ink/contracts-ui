import React from 'react';

import { CanvasContextProvider } from '../contexts';
import Router from '../router/Router';
import { routes } from '../router/config';
import Sidebar from './Sidebar';

export default function App() {
  return (
    <CanvasContextProvider>
      {/* className: dark | light */}
      <div className="dark">
        <div className="relative md:fixed flex min-h-screen inset-0 overflow-hidden dark:bg-gray-900">
          <Sidebar />
          <Router routes={routes} />
        </div>
      </div>
    </CanvasContextProvider>
  );
}
