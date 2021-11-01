import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// import { mockAbiFlipper } from 'test-utils';
import { Step3 } from 'ui/components/instantiate/Step3';

describe('Instantiate Step 3', () => {
  // const { constructors } = mockAbiFlipper;

  test.skip('renders correctly with initial values', () => {
    const { getByPlaceholderText } = render(
      <Step3 />
    );
    expect(getByPlaceholderText('initValue: <bool>')).toBeInTheDocument();
  });
  test.skip('does not render when no constructors given', () => {
    const { container } = render(<Step3 />);
    expect(container).toBeEmptyDOMElement();
  });
  test.skip('does not render when current step is not 3', () => {
    const { container } = render(
      <Step3 />
    );
    expect(container).toBeEmptyDOMElement();
  });
  test.skip('accepts user input', () => {
    const { getByPlaceholderText } = render(
      <Step3 />
    );
    const input = getByPlaceholderText('initValue: <bool>');
    expect(input).toHaveAttribute('value', '');
    fireEvent.change(input, { target: { value: 'test user Input' } });
    expect(input).toHaveAttribute('value', 'test user Input');
  });
  test.skip('dispatches the correct values', () => {
    const dispatchMock = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Step3 />
    );
    const input = getByPlaceholderText('initValue: <bool>');
    const button = getByText('Next');
    fireEvent.change(input, { target: { value: 'true' } });
    fireEvent.click(button);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'STEP_3_COMPLETE',
      payload: {
        constructorName: 'new',
        argValues: {
          initValue: 'true',
        },
      },
    });
  });
});
