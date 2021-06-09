import React from 'react';
import { CanvasContextProvider } from '../contexts';
import Main from './Main';

export default function App(): JSX.Element {
  return (
    <CanvasContextProvider>
      <Main />
    </CanvasContextProvider>
  );
}
