// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Step1 } from 'ui/components/instantiate/Step1';
import { ApiContext, DbContext, InstantiateContext } from 'ui/contexts';
import { getMockApiState, getMockDbState, getMockInstantiateState } from 'test-utils';
import { ApiState } from 'types';

async function renderWithContexts() {
  return render(
    <ApiContext.Provider
      value={{
        ...getMockApiState(),
        keyring: {
          getPairs: jest.fn(() => []),
        } as unknown as ApiState['keyring'],
      }}
    >
      <DbContext.Provider value={await getMockDbState()}>
        <InstantiateContext.Provider value={getMockInstantiateState()}>
          <Step1 />
        </InstantiateContext.Provider>
      </DbContext.Provider>
    </ApiContext.Provider>
  );
}

describe('Instantiate Step 1', () => {
  test.skip('renders correctly with initial values', async () => {
    const { getByText } = await renderWithContexts();

    expect(getByText('Account')).toBeInTheDocument();
    expect(getByText('Contract Name')).toBeInTheDocument();
    expect(getByText('Upload Contract Bundle')).toBeInTheDocument();
  });

  // test.skip('does not render if current step is not 1', async () => {
  //   const { container } = await renderWithContexts()

  //   expect(container).toBeEmptyDOMElement();
  // });
});
