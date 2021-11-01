import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Step2 } from 'ui/components/instantiate/Step2';

describe('Instantiate Step 2', () => {
  test.skip('renders correctly with initial values', () => {
    const { getByText } = render(
      <Step2 />
    );
    expect(getByText('ALICE')).toBeInTheDocument();
  });
  test.skip('does not render when current step is not 2', () => {
    const { container } = render(
      <Step2 />
    );
    expect(container).toBeEmptyDOMElement();
  });
  test.skip('dispatches the correct values', () => {
    const dispatchMock = jest.fn();
    const { getByText } = render(
      <Step2 />
    );
    const button = getByText('Next');
    fireEvent.click(button);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'STEP_2_COMPLETE',
      payload: {
        fromAddress: '5H3pnZeretwBDzaJFxKMgr4fQMsVa2Bu73nB5Tin2aQGQ9H3',
        fromAccountName: 'ALICE',
        contractName: 'flipper',
      },
    });
  });
});
