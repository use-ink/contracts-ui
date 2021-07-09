import React from 'react';
import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InstantiateStep1 from '../../../src/ui/components/instantiate/Step1';

describe('Instantiate Step 1', () => {
  test('renders correctly with initial values', () => {
    const { getByText, getByPlaceholderText } = render(
      <InstantiateStep1 dispatch={jest.fn()} currentStep={1} />
    );
    expect(getByPlaceholderText('on-chain code hash')).toBeInTheDocument();
    expect(getByText('Upload metadata.json')).toBeInTheDocument();
    expect(getByText('Next')).toBeDisabled();
  });

  test('does not render if current step is not 1', () => {
    const { container } = render(<InstantiateStep1 dispatch={jest.fn()} currentStep={2} />);

    expect(container).toBeEmptyDOMElement();
  });
});
