import React from 'react';
import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { mockKeyring } from 'test-utils/mocks';
import { Step2 } from 'ui/components/instantiate/Step2';
import { render } from 'test-utils';

const keyringPairs = mockKeyring.getPairs();

describe('Instantiate Step 2', () => {
  test('renders correctly with initial values', () => {
    const [{ getByText }] = render(
      <Step2
        contractName="flipper"
        keyringPairs={keyringPairs}
        dispatch={jest.fn()}
        currentStep={2}
      />
    );
    expect(getByText('alice')).toBeInTheDocument();
  });
  test('does not render when current step is not 2', () => {
    const [{ container }] = render(
      <Step2
        contractName="flipper"
        keyringPairs={keyringPairs}
        dispatch={jest.fn()}
        currentStep={1}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
  test('dispatches the correct values', () => {
    const dispatchMock = jest.fn();
    const [{ getByText }] = render(
      <Step2
        contractName="flipper"
        keyringPairs={keyringPairs}
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
        fromAddress: keyringPairs[0].address,
        contractName: 'flipper',
      },
    });
  });
});
