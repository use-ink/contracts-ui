// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';
import { CanvasContextProvider, DatabaseContextProvider } from '../contexts';
import { Main } from './Main';
// import { Database } from 'db';

export function App(): JSX.Element {
  return (
    <CanvasContextProvider>
      <DatabaseContextProvider>
        <Main />
      </DatabaseContextProvider>
    </CanvasContextProvider>
  );
}
