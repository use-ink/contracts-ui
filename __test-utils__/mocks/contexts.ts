// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { jest } from '@jest/globals';
import { LOCAL_NODE } from '../../src/constants';
import { getMockDb, mockDbUser } from './db';
import { mockKeyring } from './keyring';
import type { DbState, ApiPromise, InstantiateProps, ApiState } from 'types';

export const mockDbState = {
  db: undefined,
  isDbReady: true,
  identity: mockDbUser[1],
  user: mockDbUser[0],
  refreshUser: jest.fn(),
} as unknown as DbState;

export async function getMockDbStateFull(): Promise<DbState> {
  const [user, identity] = mockDbUser;

  const state = {
    db: await getMockDb(),
    isDbReady: true,
    identity,
    user,
    refreshUser: jest.fn(),
  } as unknown as DbState;

  return state;
}

export const mockApi = {
  rpc: { chain: { subscribeNewHeads: jest.fn() } },
} as unknown as ApiPromise;

export const mockApiState = {
  api: mockApi,
  endpoint: LOCAL_NODE,
  keyring: mockKeyring,
  keyringStatus: 'READY',
  status: 'READY',
} as unknown as ApiState;

export const mockInstantiateState: InstantiateProps = {
  data: {
    accountId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    argValues: { initValue: 'true' },
    codeHash: '0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d',
    constructorIndex: 0,
    value: new BN(10000),
    weight: new BN(0),
    name: 'flipper',
  },
  onSuccess: jest.fn(),
  currentStep: 1,
  tx: null,
  onError: jest.fn(),
  onInstantiate: jest.fn(),
};
