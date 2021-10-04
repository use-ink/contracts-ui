import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { Step1 } from 'ui/components/instantiate/Step1';
import { renderWithInstantiate as render } from 'test-utils';

describe('Instantiate Step 1', () => {
  test('renders correctly with initial values', async () => {
    const [{ getByText }] = await render(<Step1 />);

    expect(getByText('Account')).toBeInTheDocument();
    expect(getByText('Contract Name')).toBeInTheDocument();
    expect(getByText('Upload Contract Bundle')).toBeInTheDocument();
  });
});
