// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { customRender, getMockApiState, getMockDbState } from 'test-utils';
import { ApiState, DbState } from 'types';
import { Router, routes } from 'ui/components/Router';

describe('ApiContext', () => {
  let mockApiState: ApiState;
  let mockDbState: DbState;
  beforeAll(async (): Promise<void> => {
    [mockApiState, mockDbState] = [getMockApiState(), await getMockDbState()];
  });
  test('should render the homepage if the api and database are in a ready state', () => {
    const { getByText } = customRender(
      <Router routes={routes} />,
      {
        ...mockApiState,
        keyringStatus: 'READY',
        status: 'READY',
      },
      mockDbState
    );
    expect(getByText('Contracts')).toBeTruthy();
  });
  test('should suggest to check extension if keyring state is not ready', () => {
    const { getByText } = customRender(
      <Router routes={routes} />,
      { ...mockApiState, status: 'READY' },
      mockDbState
    );
    expect(getByText(`Loading accounts...`)).toBeTruthy();
  });
  test('should render a message if the api is not ready but the keyring is', () => {
    const { getByText } = customRender(
      <Router routes={routes} />,
      { ...mockApiState, keyringStatus: 'READY' },
      mockDbState
    );
    expect(getByText(`Connecting...`)).toBeTruthy();
  });
  test('should render the error it encountered while connecting to the node', () => {
    const { getByText } = customRender(
      <Router routes={routes} />,
      {
        ...mockApiState,
        error: { key: 'value' },
        status: 'ERROR',
      },
      mockDbState
    );

    expect(getByText(`Connection error`)).toBeTruthy();
  });
});
