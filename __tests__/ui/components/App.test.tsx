import { screen } from '@testing-library/react';
import React from 'react';
import { customRender, getMockCanvasState, getMockDbState } from 'test-utils';
import { CanvasState, DbState } from 'types';
import { Router, routes } from 'ui/components/Router';

let mockCanvasState: CanvasState;
let mockDbState: DbState;

describe('Canvas context', () => {
  beforeAll(async (): Promise<void> => {
    [mockCanvasState, mockDbState] = [await getMockCanvasState(), await getMockDbState()];
  });
  test('should render the homepage if the api and database are in a ready state', () => {
    customRender(
      <Router routes={routes} />,
      {
        ...mockCanvasState,
        keyringStatus: 'READY',
        status: 'READY',
      },
      mockDbState
    );
    expect(screen.getByText('Contracts')).toBeTruthy();
  });
  test('should suggest to check extension if keyring state is not ready', () => {
    customRender(<Router routes={routes} />, { ...mockCanvasState, status: 'READY' }, mockDbState);
    expect(screen.getByText(`Loading accounts...`)).toBeTruthy();
  });
  test('should render a message if the api is not ready but the keyring is', () => {
    customRender(
      <Router routes={routes} />,
      { ...mockCanvasState, keyringStatus: 'READY' },
      mockDbState
    );
    expect(screen.getByText(`Connecting...`)).toBeTruthy();
  });
  test('should render the error it encountered while connecting to the node', () => {
    customRender(
      <Router routes={routes} />,
      {
        ...mockCanvasState,
        error: { key: 'value' },
        status: 'ERROR',
      },
      mockDbState
    );

    expect(screen.getByText(`Connection error`)).toBeTruthy();
  });
});
