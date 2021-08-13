/* eslint-disable import/order */
/* eslint-disable import/first */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react';
import { flipperMockJson, customRender, mockAppState, keyringPairsMock } from 'test-utils';
import { Interact } from 'ui/components';

jest.mock('@polkadot/api', () => ({
  ApiPromise: jest.fn(),
}));

import { ApiPromise } from '@polkadot/api';

const mockAddr = '5CXkiX14Axfq3EoncpXduFVyhqRti1ogCF3iUYtBXRLNQpQt';

const mockCall = jest.fn();

const mockApi = new ApiPromise();

describe('Contract Interact', () => {
  test('renders correctly with initial values', () => {
    const { getByText } = customRender(
      <Interact
        metadata={flipperMockJson}
        address={mockAddr}
        keyringPairs={keyringPairsMock}
        callFn={mockCall}
      />,
      {
        ...mockAppState,
        keyringStatus: 'READY',
        status: 'READY',
        api: mockApi,
      }
    );
    expect(getByText('Message to send')).toBeInTheDocument();
    expect(getByText('flip()')).toBeInTheDocument();
    expect(getByText('Call')).not.toBeDisabled();
  });
  test('call button executes ', () => {
    const { getByText } = customRender(
      <Interact
        metadata={flipperMockJson}
        address={mockAddr}
        keyringPairs={keyringPairsMock}
        callFn={mockCall}
      />,
      {
        ...mockAppState,
        keyringStatus: 'READY',
        status: 'READY',
        api: mockApi,
      }
    );
    const submitBtn = getByText('Call');
    fireEvent.click(submitBtn);
    expect(mockCall).toHaveBeenCalledTimes(1);
  });
});
