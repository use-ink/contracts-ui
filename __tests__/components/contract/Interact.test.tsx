/* eslint-disable import/order */
/* eslint-disable import/first */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react';
import {
  flipperMockJson,
  customRender,
  getMockCanvasState,
  keyringPairsMock,
  getMockDbState,
} from 'test-utils';
import { Interact } from 'ui/components';
import type { CanvasState, DbState } from 'types';

jest.mock('@polkadot/api', () => ({
  ApiPromise: jest.fn(),
}));

jest.mock('@textile/threaddb', () => ({
  Database: jest.fn(),
}));

const mockAddr = '5CXkiX14Axfq3EoncpXduFVyhqRti1ogCF3iUYtBXRLNQpQt';

const mockCall = jest.fn();

let mockDbState: DbState;
let mockCanvasState: CanvasState;

describe('Contract Interact', () => {
  beforeAll(async () => {
    mockDbState = await getMockDbState();
    mockCanvasState = await getMockCanvasState();
  });
  test('renders correctly with initial values', () => {
    const { getByText } = customRender(
      <Interact
        metadata={flipperMockJson}
        address={mockAddr}
        keyringPairs={keyringPairsMock}
        callFn={mockCall}
      />,
      {
        ...mockCanvasState,
        keyringStatus: 'READY',
        status: 'READY',
      },
      mockDbState
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
        ...mockCanvasState,
        keyringStatus: 'READY',
        status: 'READY',
      },
      mockDbState
    );
    const submitBtn = getByText('Call');
    fireEvent.click(submitBtn);
    expect(mockCall).toHaveBeenCalledTimes(1);
  });
});
