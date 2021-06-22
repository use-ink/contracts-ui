import { render, screen } from '@testing-library/react';
import React from 'react';
import Main from '../../src/components/Main';
import { CanvasContext } from '../../src/contexts';
import { AppState } from '../../src/types';

const customRender = (ui: JSX.Element, providerProps: AppState) => {
  return render(<CanvasContext.Provider value={providerProps}>{ui}</CanvasContext.Provider>);
};

const mockState: AppState = {
  socket: '',
  keyring: null,
  keyringState: null,
  api: null,
  apiError: null,
  apiState: null,
};

describe('Canvas UI app', () => {
  test('should render the homepage if the api and keyring are in a ready state', () => {
    customRender(<Main />, { ...mockState, keyringState: 'READY', apiState: 'READY' });
    // expect(home).toBeTruthy();
  });
  test('should suggest to check extension if keyring state is not ready', () => {
    customRender(<Main />, { ...mockState, apiState: 'READY' });
    expect(
      screen.getByText(`Loading accounts (please review any extension's authorization)`)
    ).toBeTruthy();
  });
  test('should render a message if the api is not ready but the keyring is', () => {
    customRender(<Main />, { ...mockState, keyringState: 'READY' });
    expect(screen.getByText(`Connecting to substrate node`)).toBeTruthy();
  });
  test('should render the error it encountered while connecting to the node', () => {
    customRender(<Main />, { ...mockState, apiError: { key: 'value' }, apiState: 'ERROR' });
    expect(screen.getByText(`Connection error {"key":"value"}`)).toBeTruthy();
  });
});
