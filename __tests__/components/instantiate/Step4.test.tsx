import React from 'react';
import { jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { mockInstantiateState, mockAppState, customRender } from '../../../test-utils';
import { Step4 } from '@ui/components';

const mockSubmitHandler = jest.fn();

describe('Instantiate Step 4', () => {
  test('displays a button that calls the submit handler', () => {
    customRender(
      <Step4
        state={mockInstantiateState}
        dispatch={jest.fn()}
        currentStep={4}
        submitHandler={mockSubmitHandler}
      />,
      { ...mockAppState }
    );
    const submitBtn = screen.getByText('Instantiate');
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);
    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
  });
  test('does not render when current step is not 3', () => {
    const { container } = render(
      <Step4
        state={mockInstantiateState}
        dispatch={jest.fn()}
        currentStep={1}
        submitHandler={mockSubmitHandler}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
