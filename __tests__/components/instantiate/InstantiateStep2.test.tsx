import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InstantiateStep2 from '../../../src/ui/components/instantiate/InstantiateStep2';
import { keyringPairsMock } from '../../../test-utils/mockData';

describe('Instantiate Step 2', () => {
  test('renders correctly with initial values', () => {
    const { getByText } = render(
      <InstantiateStep2
        contractName="flipper"
        keyringPairs={keyringPairsMock}
        dispatch={jest.fn()}
        currentStep={2}
      />
    );
    expect(getByText('ALICE')).toBeInTheDocument();
  });
  test('does not render when current step is not 2', () => {
    const { container } = render(
      <InstantiateStep2
        contractName="flipper"
        keyringPairs={keyringPairsMock}
        dispatch={jest.fn()}
        currentStep={1}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
  test('dispatches the correct values', () => {
    const dispatchMock = jest.fn();
    const { getByText } = render(
      <InstantiateStep2
        contractName="flipper"
        keyringPairs={keyringPairsMock}
        dispatch={dispatchMock}
        currentStep={2}
      />
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
