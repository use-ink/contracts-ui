import React from 'react';
import { render } from '@testing-library/react';
import { jest } from '@jest/globals';
import { MemoryRouter } from 'react-router';
import { CanvasContext, DbContext } from '../src/ui/contexts';
import { CanvasState, DbState, ApiPromise } from '../src/types';

export const customRender = (ui: JSX.Element, canvasState: CanvasState, dbState: DbState) => {
  return render(
    <CanvasContext.Provider value={canvasState}>
      <DbContext.Provider value={dbState}>
        <MemoryRouter>{ui}</MemoryRouter>
      </DbContext.Provider>
    </CanvasContext.Provider>
  );
};

export function createMockApi() {
  const api = {
    rpc: { chain: { subscribeNewHeads: jest.fn() } },
  };
  return api as unknown as ApiPromise;
}
