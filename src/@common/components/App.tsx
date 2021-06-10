// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import React from 'react';
import { Main } from './Main';
import { CanvasContextProvider } from '@canvas';

export function App(): JSX.Element {
  return (
    <CanvasContextProvider>
      <Main />
    </CanvasContextProvider>
  );
}
