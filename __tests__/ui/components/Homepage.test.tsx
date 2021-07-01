/**
 * @jest-environment ./db-test-env
 */
// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import 'fastestsmallesttextencoderdecoder';
import React from 'react';
import { render } from '@testing-library/react';
import { Homepage } from '@ui/components';

describe('Homepage', () => {
  test('it loads', () => {
    const { getByText } = render(<Homepage />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
