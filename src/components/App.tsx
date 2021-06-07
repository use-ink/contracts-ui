import React from 'react';
import { CanvasContextProvider } from '../api-wrapper';
import Main from './Main';

export default function App(): JSX.Element {
  return (
    <CanvasContextProvider>
      <Main />
    </CanvasContextProvider>
  );
}
