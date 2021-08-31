import React from 'react';
import { jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {
  getMockInstantiateState,
  getMockCanvasState,
  getMockDbState,
  customRender,
} from 'test-utils';
import { Step4 } from 'ui/components/instantiate/HashSteps';
import { DbState } from 'types';

const mockSubmitHandler = jest.fn();

let mockDbState: DbState;

describe('Instantiate Step 4', () => {
  beforeAll(async (): Promise<void> => {
    mockDbState = await getMockDbState();
  });
  test('displays a button that calls the submit handler', () => {
    customRender(
      <Step4
        state={getMockInstantiateState()}
        dispatch={jest.fn()}
        currentStep={4}
        submitHandler={mockSubmitHandler}
      />,
      { ...getMockCanvasState() },
      { ...mockDbState }
    );
    const submitBtn = screen.getByText('Instantiate');
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);
    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
  });
  test('does not render when current step is not 3', () => {
    const { container } = render(
      <Step4
        state={getMockInstantiateState()}
        dispatch={jest.fn()}
        currentStep={1}
        submitHandler={mockSubmitHandler}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
