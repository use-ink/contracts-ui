// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { render, screen } from '@testing-library/react';
import React from 'react';
import { Main } from '@common';
import { CanvasContext } from '@canvas';

import type { CanvasState } from '@canvas';

const customRender = (ui: JSX.Element, providerProps: CanvasState) => {
  return render(<CanvasContext.Provider value={providerProps}>{ui}</CanvasContext.Provider>);
};

const mockState: CanvasState = {
  endpoint: '',
  keyring: null,
  keyringStatus: null,
  api: null,
  error: null,
  status: null,
  blockOneHash: null,
};

describe('Canvas UI app', () => {
  it('should render the homepage if the api and keyring are in a ready state', async () => {
    customRender(<Main />, { ...mockState, keyringStatus: 'READY', status: 'READY' });
    expect(screen.getByText(`Hello`)).toBeTruthy();
  });
  it('should suggest to check extension if keyring state is not ready', async () => {
    customRender(<Main />, { ...mockState });
    expect(
      screen.getByText(`Loading accounts (please review any extension's authorization)`)
    ).toBeTruthy();
  });
  it('should render a message if the api is not ready but the keyring is', async () => {
    customRender(<Main />, { ...mockState, keyringStatus: 'READY' });
    expect(screen.getByText(`Connecting to substrate node`)).toBeTruthy();
  });
  it('should render the error it encountered while connecting to the node', async () => {
    customRender(<Main />, { ...mockState, error: 'xyz', status: 'ERROR' });
    expect(screen.getByText(`Connection error xyz`)).toBeTruthy();
  });
});
