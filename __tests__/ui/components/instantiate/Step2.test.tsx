// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Step2 } from 'ui/components/instantiate/Step2';
import { InstantiateContext } from 'ui/contexts';
import { customRender as customRenderBase, getMockInstantiateState } from 'test-utils';

function customRender() {
  return customRenderBase(
    <InstantiateContext.Provider value={getMockInstantiateState()}>
      <Step2 />
    </InstantiateContext.Provider>
  );
}

describe('Instantiate Step 2', () => {
  test.skip('renders correctly with initial values', () => {
    const [{ getByText }] = customRender();

    expect(getByText('alice')).toBeInTheDocument();
  });

  test.skip('does not render when current step is not 2', () => {
    const [{ container }] = customRender();

    expect(container).toBeEmptyDOMElement();
  });

  test.skip('dispatches the correct values', () => {
    const [{ getByText }] = customRender();

    const button = getByText('Next');
    fireEvent.click(button);
  });
});
