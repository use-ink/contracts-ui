/* eslint-disable import/order */
/* eslint-disable import/first */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react';
import { flipperMockJson, customRender, getMockCanvasState, getMockDbState } from 'test-utils';
import { Interact } from 'ui/components';
import { CanvasState, DbState } from 'types';

describe('Contract Interact', () => {
  const mockAddr = '5CXkiX14Axfq3EoncpXduFVyhqRti1ogCF3iUYtBXRLNQpQt';

  const mockCall = jest.fn();

  let mockDbState: DbState;
  let mockCanvasState: CanvasState;
  beforeAll(async () => {
    mockDbState = await getMockDbState();
    mockCanvasState = getMockCanvasState();
  });
  afterAll(async () => {
    await mockDbState.db.delete();
  });
  test('renders correctly with initial values', () => {
    const { getByText } = customRender(
      <Interact metadata={flipperMockJson} contractAddress={mockAddr} callFn={mockCall} />,
      {
        ...mockCanvasState,
        keyringStatus: 'READY',
        status: 'READY',
      },
      mockDbState
    );
    expect(getByText('Message to send')).toBeInTheDocument();
    expect(getByText('flip')).toBeInTheDocument();
    expect(getByText('Call')).not.toBeDisabled();
  });
  test('call button executes ', () => {
    const { getByText } = customRender(
      <Interact metadata={flipperMockJson} contractAddress={mockAddr} callFn={mockCall} />,
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
