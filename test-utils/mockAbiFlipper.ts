import { jest } from '@jest/globals';
import { Abi } from 'types';

export const mockAbiFlipper = {
  constructors: [
    {
      method: 'new',
      identifier: 'new',
      index: 0,
      args: [
        {
          name: 'initValue',
          type: {
            info: 6,
            type: 'bool',
          },
        },
      ],
      docs: ['Creates a new flipper smart contract initialized with the given value.'],
    },
    {
      method: 'default',
      identifier: 'default',
      index: 1,
      args: [],
      docs: ['Creates a new flipper smart contract initialized to `false`.'],
    },
  ],
  messages: [
    {
      args: [],
      docs: [" Flips the current value of the Flipper's bool."],
      identifier: 'flip',
      index: 0,
      isMutating: true,
      isPayable: false,
      method: 'flip',
      returnType: null,
    },
    {
      args: [],
      docs: [" Returns the current value of the Flipper's bool."],
      identifier: 'get',
      index: 1,
      isMutating: false,
      isPayable: false,
      method: 'get',
    },
  ],
  findMessage: jest.fn().mockReturnValue({
    identifier: 'flip',
    index: 1,
    args: [],
    isPayable: false,
    isMutating: true,
  }),
} as unknown as Abi;
