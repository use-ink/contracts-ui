import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Step1 } from 'ui/components/instantiate/Step1';
import { CanvasContext, DbContext, InstantiateContext } from 'ui/contexts';
import { getMockCanvasState, getMockDbState, getMockInstantiateState } from 'test-utils';

async function renderWithContexts () {
  return render(
    <CanvasContext.Provider value={getMockCanvasState()}>
      <DbContext.Provider value={(await getMockDbState())}>
        <InstantiateContext.Provider value={getMockInstantiateState()}>
          <Step1 />
        </InstantiateContext.Provider>
      </DbContext.Provider>
    </CanvasContext.Provider>
  )
}

describe('Instantiate Step 1', () => {
  test('renders correctly with initial values', async () => {
    const { getByText, getByPlaceholderText } = await renderWithContexts();

    expect(getByPlaceholderText('on-chain code hash')).toBeInTheDocument();
    expect(getByText('Account')).toBeInTheDocument();
    expect(getByText('Contract Name')).toBeInTheDocument();
    expect(getByText('Upload Contract Bundle')).toBeInTheDocument();
  });

  // test('does not render if current step is not 1', async () => {
  //   const { container } = await renderWithContexts()

  //   expect(container).toBeEmptyDOMElement();
  // });
});
