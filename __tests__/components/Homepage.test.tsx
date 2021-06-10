// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Homepage } from '@common';

it('loads', () => {
  render(<Homepage />);
  expect(screen.getByRole('heading').textContent).toContain('Hello');
});
