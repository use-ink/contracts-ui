import React from 'react';
import { jest } from '@jest/globals';
import { render as testingLibraryRender, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import {
  renderHook as testingLibraryRenderHook,
  WrapperComponent,
  RenderHookOptions,
  RenderHookResult,
} from '@testing-library/react-hooks';
import {
  CanvasContext,
  DbContext,
  InstantiateContext,
  TransactionsContext,
} from '../src/ui/contexts';
import { CanvasState, InstantiateState, DbState, TransactionsState } from '../src/types';
import { mockCanvasState, mockInstantiateState, mockDbState } from './mocks';

export type RenderedPlusStates<T> = [T, CanvasState, DbState];

export type RenderedInstantiate<T> = [T, CanvasState, DbState, InstantiateState];

export function render(
  ui: React.ReactElement,
  canvas?: Partial<CanvasState>,
  db?: Partial<DbState>
): RenderedPlusStates<RenderResult> {
  const canvasState = { ...mockCanvasState, ...canvas } as CanvasState;
  const dbState = { ...mockDbState, ...db };
  const transactionsState = {
    txs: [],
    dismiss: jest.fn(),
    process: jest.fn(),
    queue: jest.fn(),
    unqueue: jest.fn(),
  } as TransactionsState;

  return [
    testingLibraryRender(
      <CanvasContext.Provider value={canvasState}>
        <DbContext.Provider value={dbState}>
          <TransactionsContext.Provider value={transactionsState}>
            <MemoryRouter>{ui}</MemoryRouter>
          </TransactionsContext.Provider>
        </DbContext.Provider>
      </CanvasContext.Provider>
    ),
    canvasState,
    dbState,
  ];
}

export function renderWithInstantiate(
  ui: React.ReactElement,
  overrides: Partial<InstantiateState> = {}
): RenderedInstantiate<RenderResult> {
  const state = { ...mockInstantiateState, ...overrides };

  return [
    ...render(<InstantiateContext.Provider value={state}>{ui}</InstantiateContext.Provider>),
    state,
  ];
}

export function renderHook<T, U>(
  callback: (_: T) => U,
  canvas?: Partial<CanvasState>,
  db?: Partial<DbState>,
  options?: RenderHookOptions<T>
): RenderedPlusStates<RenderHookResult<T, U>> {
  const canvasState = { ...mockCanvasState, ...canvas } as CanvasState;
  const dbState = { ...mockDbState, ...db };

  const wrapper = createWrapper<T>(canvasState, dbState);

  return [testingLibraryRenderHook<T, U>(callback, { wrapper, ...options }), canvasState, dbState];
}

export function createWrapper<T>(
  canvas?: Partial<CanvasState>,
  db?: Partial<DbState>
): WrapperComponent<T> {
  const canvasState = { ...mockCanvasState, ...canvas } as CanvasState;
  const dbState = { ...mockDbState, ...db } as DbState;

  return ({ children }) => {
    return (
      <CanvasContext.Provider value={canvasState}>
        <DbContext.Provider value={dbState}>
          <MemoryRouter>{children}</MemoryRouter>
        </DbContext.Provider>
      </CanvasContext.Provider>
    );
  };
}
