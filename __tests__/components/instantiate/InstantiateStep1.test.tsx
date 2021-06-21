import React from 'react';
import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InstantiateStep1 from '../../../src/components/instantiate/InstantiateStep1';
import { keyringPairsMock } from '../../../test-utils/mockData';

describe('Instantiate Step 1', () => {
  test('renders correctly with initial values', () => {
    const { getByText } = render(
      <InstantiateStep1
        keyringPairs={keyringPairsMock}
        codeHashes={['0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d']}
        dispatch={jest.fn()}
        currentStep={1}
      />
    );
    expect(getByText('ALICE')).toBeInTheDocument();
    expect(getByText('Upload metadata.json')).toBeInTheDocument();
    expect(getByText('Next')).toBeDisabled();
  });

  test('does not render if current step is not 1', () => {
    const { container } = render(
      <InstantiateStep1
        keyringPairs={keyringPairsMock}
        codeHashes={['0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d']}
        dispatch={jest.fn()}
        currentStep={2}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
