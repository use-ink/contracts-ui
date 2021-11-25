// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { Step1 } from 'ui/components/instantiate/Step1';
import { InstantiateContextProvider } from 'ui/contexts';
import { customRender as customRenderBase, mockInstantiateState } from 'test-utils';

function customRender() {
  return customRenderBase(
    <InstantiateContextProvider {...mockInstantiateState}>
      <Step1 />
    </InstantiateContextProvider>
  );
}

describe('Instantiate Step 1', () => {
  test.skip('renders correctly with initial values', () => {
    const [{ getByText }] = customRender();

    expect(getByText('Account')).toBeInTheDocument();
    expect(getByText('Contract Name')).toBeInTheDocument();
    expect(getByText('Upload Contract Bundle')).toBeInTheDocument();
  });
});
