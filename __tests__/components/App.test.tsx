import { render, screen } from '@testing-library/react';
import React from 'react';
import Main from '../../src/components/Main';
import { CanvasContext } from '../../src/api-wrapper';
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
  it('should render the homepage if the api and keyring are in a ready state', async () => {
    customRender(<Main />, { ...mockState, keyringState: 'READY', apiState: 'READY' });
    expect(screen.getByText(`Hello`)).toBeTruthy();
  });
  it('should suggest to check extension if keyring state is not ready', async () => {
    customRender(<Main />, { ...mockState });
    expect(
      screen.getByText(`Loading accounts (please review any extension's authorization)`)
    ).toBeTruthy();
  });
  it('should render a message if the api is not ready but the keyring is', async () => {
    customRender(<Main />, { ...mockState, keyringState: 'READY' });
    expect(screen.getByText(`Connecting to substrate node`)).toBeTruthy();
  });
  it('should render the error it encountered while connecting to the node', async () => {
    customRender(<Main />, { ...mockState, apiError: 'xyz', apiState: 'ERROR' });
    expect(screen.getByText(`Connection error xyz`)).toBeTruthy();
  });
});
