import React from 'react';
import { render, screen } from '@testing-library/react';
import Homepage from '../../src/components/Homepage';

it('loads', () => {
  render(<Homepage />);
  expect(screen.getByRole('heading').textContent).toContain('Hello');
});
