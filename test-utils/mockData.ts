import type { CanvasState, InstantiateState } from 'types';

export const keyringPairsMock = [
  { address: '5H3pnZeretwBDzaJFxKMgr4fQMsVa2Bu73nB5Tin2aQGQ9H3', meta: { name: 'alice' } },
  {
    address: '5HKbr8t4Qg5y9kZBU9nwuDkoTsPShGQHYUbvyoB4ujvfKsbL',
    meta: { name: 'alice_stash' },
  },
  { address: '5DkocVtKdD6wM7qrSAVTpR4jfTAPHvQhbrDZ6ZUB39d1DWzf', meta: { name: 'bob' } },
  {
    address: '5DUpcTjvPXG63kt1z8iwacJv7W7m6YuxfKCd4NoJtXhaUt6h',
    meta: { name: 'bob_stash' },
  },
];
export const flipperMock = {
  constructors: [
    {
      method: 'new',
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
      index: 1,
      args: [],
      docs: ['Creates a new flipper smart contract initialized to `false`.'],
    },
  ],
};
export const mockInstantiateState: InstantiateState = {
  isLoading: false,
  isSuccess: false,
  contract: null,
  currentStep: 1,
  fromAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  codeHash: '0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d',
  constructorName: 'new',
  argValues: { initValue: 'true' },
  contractName: 'flipper',
};
export const mockAppState: CanvasState = {
  endpoint: '',
  keyring: null,
  keyringStatus: null,
  api: null,
  error: null,
  status: null,
  blockOneHash: '',
  systemName: 'Development',
  systemVersion: '0'
};
