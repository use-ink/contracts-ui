import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react';
import { render } from 'test-utils';
import { InteractTab } from 'ui/components';
import { ContractPromise } from 'types';

jest.mock('react-hot-loader', () => {
  return {
    hot: () => (thing: unknown) => thing,
  };
});

describe('Contract Interact Tab', () => {
  // const mockAddr = '5CXkiX14Axfq3EoncpXduFVyhqRti1ogCF3iUYtBXRLNQpQt';

  const mockCall = jest.fn();

  const mockContract = {} as ContractPromise;

  test('renders correctly with initial values', () => {
    const [{ getByText }] = render(<InteractTab contract={mockContract} />, {
      keyringStatus: 'READY',
      status: 'READY',
    });

    expect(getByText('Message to send')).toBeInTheDocument();
    expect(getByText('flip')).toBeInTheDocument();
    expect(getByText('Call')).not.toBeDisabled();
  });
  test('call button executes ', () => {
    const [{ getByText }] = render(<InteractTab contract={mockContract} />, {
      keyringStatus: 'READY',
      status: 'READY',
    });

    const submitBtn = getByText('Call');
    fireEvent.click(submitBtn);
    expect(mockCall).toHaveBeenCalledTimes(1);
  });
});
