// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';
import { Main } from './Main';
import { CanvasContextProvider, DatabaseContextProvider } from '@ui/contexts';
// import { Database } from '@db';

export function App(): JSX.Element {
  return (
    <CanvasContextProvider>
      <DatabaseContextProvider>
        <Main />
      </DatabaseContextProvider>
    </CanvasContextProvider>
  );
}
