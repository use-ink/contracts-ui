import React from 'react'
import Main from './Main'

import { CanvasContext, CanvasContextProvider } from '../api-wrapper';


export default function App():JSX.Element {
  return (
    <CanvasContextProvider>
      <Main />
    </CanvasContextProvider>
  );
}