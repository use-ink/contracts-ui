import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { CanvasContext } from '../src/ui/contexts';
import { CanvasState } from '../src/types';

export const customRender = (ui: JSX.Element, providerProps: CanvasState) => {
  return render(
    <CanvasContext.Provider value={providerProps}>
      <MemoryRouter>{ui}</MemoryRouter>
    </CanvasContext.Provider>
  );
};
