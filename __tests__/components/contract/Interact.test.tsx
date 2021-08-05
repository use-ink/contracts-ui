/* eslint-disable import/order */
/* eslint-disable import/first */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { flipperMockJson, customRender, mockAppState, keyringPairsMock } from 'test-utils';
import { Interact } from 'ui/components';

jest.mock('@polkadot/api', () => {
  // eslint-disable-next-line no-unused-labels
  ApiPromise: jest.fn();
});

import { ApiPromise } from '@polkadot/api';

const mockAddr = '5CXkiX14Axfq3EoncpXduFVyhqRti1ogCF3iUYtBXRLNQpQt';

describe('Contract Interact', () => {
  test('renders correctly with initial values', () => {
    const { getByText } = customRender(
      <Interact metadata={flipperMockJson} address={mockAddr} keyringPairs={keyringPairsMock} />,
      {
        ...mockAppState,
        keyringStatus: 'READY',
        status: 'READY',
        api: new ApiPromise(),
      }
    );
    expect(getByText('Message to send')).toBeInTheDocument();
    expect(getByText('flip()')).toBeInTheDocument();
    expect(getByText('Call')).not.toBeDisabled();
  });
});
