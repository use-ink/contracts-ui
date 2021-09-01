import React from 'react';
import { customRender, getMockCanvasState, getMockDbState } from 'test-utils';
import { CanvasState, DbState } from 'types';
import { Router, routes } from 'ui/components/Router';

describe('Canvas context', () => {
  let mockCanvasState: CanvasState;
  let mockDbState: DbState;
  beforeAll(async (): Promise<void> => {
    [mockCanvasState, mockDbState] = [getMockCanvasState(), await getMockDbState()];
  });
  test('should render the homepage if the api and database are in a ready state', () => {
    const { getByText } = customRender(
      <Router routes={routes} />,
      {
        ...mockCanvasState,
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
      { ...mockCanvasState, status: 'READY' },
      mockDbState
    );
    expect(getByText(`Loading accounts...`)).toBeTruthy();
  });
  test('should render a message if the api is not ready but the keyring is', () => {
    const { getByText } = customRender(
      <Router routes={routes} />,
      { ...mockCanvasState, keyringStatus: 'READY' },
      mockDbState
    );
    expect(getByText(`Connecting...`)).toBeTruthy();
  });
  test('should render the error it encountered while connecting to the node', () => {
    const { getByText } = customRender(
      <Router routes={routes} />,
      {
        ...mockCanvasState,
        error: { key: 'value' },
        status: 'ERROR',
      },
      mockDbState
    );

    expect(getByText(`Connection error`)).toBeTruthy();
  });
});
