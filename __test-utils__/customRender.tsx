// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import {
  renderHook,
  WrapperComponent,
  RenderHookOptions,
  RenderHookResult,
} from '@testing-library/react-hooks';
import { ApiContext, DbContext } from '../src/ui/contexts';
import { ApiState, DbState } from '../src/types';
import { mockApiState, mockDbState } from './mocks';

type RenderedPlusStates<T> = [T, ApiState, DbState];

export function customRender(
  ui: React.ReactElement,
  api?: Partial<ApiState>,
  db?: Partial<DbState>
): RenderedPlusStates<RenderResult> {
  const apiState = { ...mockApiState, ...api } as ApiState;
  const dbState = { ...mockDbState, ...db };

  return [
    render(
      <ApiContext.Provider value={apiState}>
        <DbContext.Provider value={dbState}>
          <MemoryRouter>{ui}</MemoryRouter>
        </DbContext.Provider>
      </ApiContext.Provider>
    ),
    apiState,
    dbState,
  ];
}

export function customRenderHook<T, U>(
  callback: (_: T) => U,
  api?: Partial<ApiState>,
  db?: Partial<DbState>,
  options?: RenderHookOptions<T>
): RenderedPlusStates<RenderHookResult<T, U>> {
  const apiState = { ...mockApiState, ...api } as ApiState;
  const dbState = { ...mockDbState, ...db };

  const wrapper = createWrapper<T>(apiState, dbState);

  return [renderHook<T, U>(callback, { wrapper, ...options }), apiState, dbState];
}

function createWrapper<T>(api?: Partial<ApiState>, db?: Partial<DbState>): WrapperComponent<T> {
  const apiState = { ...mockApiState, ...api } as ApiState;
  const dbState = { ...mockDbState, ...db } as DbState;

  return ({ children }) => {
    return (
      <ApiContext.Provider value={apiState}>
        <DbContext.Provider value={dbState}>
          <MemoryRouter>{children}</MemoryRouter>
        </DbContext.Provider>
      </ApiContext.Provider>
    );
  };
}
