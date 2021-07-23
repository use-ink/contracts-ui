import { screen } from '@testing-library/react';
import React from 'react';
import { customRender } from 'test-utils';
import { Homepage } from 'ui/components';
import { Router } from 'ui/components/Router';

const mockState = {
  endpoint: 'test123',
  keyring: null,
  keyringStatus: null,
  api: null,
  error: null,
  status: null,
  blockOneHash: null,
  systemName: 'Development',
  systemVersion: '0'
};

const routes = [
  {
    path: '/',
    component: Homepage,
    exact: true,
    fallback: <div> Loading... </div>,
  },
];

describe('Canvas context', () => {
  test('should render the homepage if the api and keyring are in a ready state', () => {
    customRender(<Router routes={routes} />, {
      ...mockState,
      keyringStatus: 'READY',
      status: 'READY',
    });
    expect(screen.getByText('Homepage')).toBeTruthy();
  });
  test('should suggest to check extension if keyring state is not ready', () => {
    customRender(<Router routes={routes} />, { ...mockState, status: 'READY' });
    expect(
      screen.getByText(`Loading accounts (please review any extension's authorization)`)
    ).toBeTruthy();
  });
  test('should render a message if the api is not ready but the keyring is', () => {
    customRender(<Router routes={routes} />, { ...mockState, keyringStatus: 'READY' });
    expect(screen.getByText(`Connecting to substrate node`)).toBeTruthy();
  });
  test('should render the error it encountered while connecting to the node', () => {
    customRender(<Router routes={routes} />, {
      ...mockState,
      error: { key: 'value' },
      status: 'ERROR',
    });

    expect(screen.getByText(`Connection error [object Object]`)).toBeTruthy();
  });
});
