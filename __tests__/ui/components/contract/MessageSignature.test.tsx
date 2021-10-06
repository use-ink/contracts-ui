// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MessageSignature } from 'ui/components';

describe('Transaction Result', () => {
  test('correctly renders a message', () => {
    const { getByText, container } = render(<MessageSignature method="test_method" />);

    expect(getByText('test_method')).toBeInTheDocument();
    expect(container.getElementsByClassName('icon-payable').length).toBe(0);
    expect(container.getElementsByClassName('icon-mutating').length).toBe(0);
  });

  test('renders icons for payable and mutating messages', () => {
    const { getByText, container } = render(
      <MessageSignature method="test_method" isMutating={true} isPayable={true} returnType="bool" />
    );

    expect(getByText('bool')).toBeInTheDocument();
    expect(container.getElementsByClassName('icon-payable').length).toBe(1);
    expect(container.getElementsByClassName('icon-mutating').length).toBe(1);
  });
});
