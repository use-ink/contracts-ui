import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { Step2 } from 'ui/components/instantiate/Step2';
import { renderWithInstantiate as render } from 'test-utils';

describe('Instantiate Step 2', () => {
  test('renders correctly with initial values', () => {
    const [{ getByText }] = render(<Step2 />);

    expect(getByText('alice')).toBeInTheDocument();
  });

  // test('dispatches the correct values', () => {
  //   const dispatchMock = jest.fn();
  //   const [{ getByText }] = render(
  //     <Step2 />
  //   );

  //   const button = getByText('Next');
  //   fireEvent.click(button);
  //   expect(dispatchMock).toHaveBeenCalledTimes(1);
  //   expect(dispatchMock).toHaveBeenCalledWith({
  //     type: 'STEP_2_COMPLETE',
  //     payload: {
  //       fromAddress: keyringPairs[0].address,
  //       contractName: 'flipper',
  //     },
  //   });
  // });
});
