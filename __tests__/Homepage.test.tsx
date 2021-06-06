import React from 'react';
import { render } from '@testing-library/react';
import Homepage from '../src/components/Homepage';

it('loads', async () => {
  const { container } = render(<Homepage />);
  expect(container.querySelector('h1').textContent).toBe('Hello');
})