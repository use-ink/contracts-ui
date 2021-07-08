import React from 'react';
import { render } from '@testing-library/react';
import { CanvasContext } from '../src/ui/contexts';
import { CanvasState } from '../src/ui/types';

export const customRender = (ui: JSX.Element, providerProps: CanvasState) => {
  return render(<CanvasContext.Provider value={providerProps}>{ui}</CanvasContext.Provider>);
};
