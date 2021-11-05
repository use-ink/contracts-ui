// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { customRender } from 'test-utils';
import { Router, routes } from 'ui/router';

describe('ApiContext', () => {
  test.skip('should render the homepage if the api and database are in a ready state', () => {
    const [{ getByText }] = customRender(<Router routes={routes} />);
    expect(getByText('Contracts')).toBeTruthy();
  });
  test.skip('should suggest to check extension if keyring state is not ready', () => {
    const [{ getByText }] = customRender(<Router routes={routes} />);
    expect(getByText(`Loading accounts...`)).toBeTruthy();
  });
  test.skip('should render a message if the api is not ready but the keyring is', () => {
    const [{ getByText }] = customRender(<Router routes={routes} />);
    expect(getByText(`Connecting...`)).toBeTruthy();
  });
  test.skip('should render the error it encountered while connecting to the node', () => {
    const [{ getByText }] = customRender(<Router routes={routes} />);

    expect(getByText(`Connection error`)).toBeTruthy();
  });
});
