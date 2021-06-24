import React from 'react';
import { render } from '@testing-library/react';
import { CanvasContext } from '../src/contexts';
import { AppState } from '../src/types';

export const customRender = (ui: JSX.Element, providerProps: AppState) => {
  return render(<CanvasContext.Provider value={providerProps}>{ui}</CanvasContext.Provider>);
};
