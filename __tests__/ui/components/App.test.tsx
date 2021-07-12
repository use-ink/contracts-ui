import { screen } from '@testing-library/react';
import React from 'react';
import { customRender } from '../../../test-utils';
import { Main } from '@ui/components/Main';

const mockState = {
  endpoint: 'test123',
  keyring: null,
  keyringStatus: null,
  api: null,
  error: null,
  status: null,
  blockOneHash: null,
};

describe('Canvas context', () => {
  test('should render the homepage if the api and keyring are in a ready state', () => {
    customRender(<Main />, { ...mockState, keyringStatus: 'READY', status: 'READY' });
    // expect(home).toBeTruthy();
  });
  test('should suggest to check extension if keyring state is not ready', () => {
    customRender(<Main />, { ...mockState, status: 'READY' });
    expect(
      screen.getByText(`Loading accounts (please review any extension's authorization)`)
    ).toBeTruthy();
  });
  test('should render a message if the api is not ready but the keyring is', () => {
    customRender(<Main />, { ...mockState, keyringStatus: 'READY' });
    expect(screen.getByText(`Connecting to substrate node`)).toBeTruthy();
  });
  test('should render the error it encountered while connecting to the node', () => {
    customRender(<Main />, { ...mockState, error: { key: 'value' }, status: 'ERROR' });
    expect(screen.getByText(`Connection error {"key":"value"}`)).toBeTruthy();
  });
});
