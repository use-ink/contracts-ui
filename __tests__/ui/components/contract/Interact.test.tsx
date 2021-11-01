// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react';
import { customRender, mockContract } from 'test-utils';
import { InteractTab } from 'ui/components/contract/Interact';

describe('Contract Interact Tab', () => {
  // const mockAddr = '5CXkiX14Axfq3EoncpXduFVyhqRti1ogCF3iUYtBXRLNQpQt';

  const mockCall = jest.fn();

  test.skip('renders correctly with initial values', () => {
    const [{ getByText }] = customRender(<InteractTab contract={mockContract} />);

    expect(getByText('Message to send')).toBeInTheDocument();
    expect(getByText('flip')).toBeInTheDocument();
    expect(getByText('Call')).not.toBeDisabled();
  });
  test.skip('call button executes ', () => {
    const [{ getByText }] = customRender(<InteractTab contract={mockContract} />);

    const submitBtn = getByText('Call');
    fireEvent.click(submitBtn);
    expect(mockCall).toHaveBeenCalledTimes(1);
  });
});
