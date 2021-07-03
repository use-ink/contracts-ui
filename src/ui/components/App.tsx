// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';
import { CanvasContextProvider, DatabaseContextProvider } from '../contexts';
import Sidebar from './Sidebar';
import { routes as Routes, Router } from '@ui/router';

export default function App(): JSX.Element {
  return (
    <CanvasContextProvider>
      <DatabaseContextProvider>
        <Sidebar />
        <Router routes={Routes} />
      </DatabaseContextProvider>
    </CanvasContextProvider>
  );
}
