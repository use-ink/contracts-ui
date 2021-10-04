import React from 'react';
import { render } from 'test-utils';
import { Router, routes } from 'ui/components/Router';

describe('Canvas context', () => {
  test('should render the homepage if the api and database are in a ready state', () => {
    const [{ getByText }] = render(<Router routes={routes} />);
    expect(getByText('Contracts')).toBeTruthy();
  });
  test('should suggest to check extension if keyring state is not ready', () => {
    const [{ getByText }] = render(<Router routes={routes} />, { keyringStatus: 'LOADING' });
    expect(getByText(`Loading accounts...`)).toBeTruthy();
  });
  test('should render a message if the api is not ready but the keyring is', () => {
    const [{ getByText }] = render(<Router routes={routes} />, { status: 'LOADING' });
    expect(getByText(`Connecting...`)).toBeTruthy();
  });
  test('should render the error it encountered while connecting to the node', () => {
    const [{ getByText }] = render(<Router routes={routes} />, {
      error: { key: 'value' },
      status: 'ERROR',
    });

    expect(getByText(`Connection error`)).toBeTruthy();
  });
});
