import React from 'react';
import { render } from '@testing-library/react';
import Homepage from '../../src/components/Homepage';

describe('Homepage', () => {
  test('it loads', () => {
    const { getByText } = render(<Homepage />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
