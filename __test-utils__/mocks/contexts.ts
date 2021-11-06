// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { jest } from '@jest/globals';
import { randomAsHex } from '@polkadot/util-crypto';
import { LOCAL_NODE } from '../../src/constants';
import { getMockDb, mockDbUser } from './db';
import { mockKeyring } from './keyring';
import { getMockFormField } from './hooks';
import type { DbState, ApiPromise, InstantiateProps, AbiConstructor } from 'types';

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
} as unknown as CanvasState;

export function getMockInstantiateState(): InstantiateProps {
  return {
    accountId: getMockFormField<string | null>(
      '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      true
    ),
    argValues: [{ initValue: 'true' }, jest.fn()],
    codeHash: '0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d',
    constructorIndex: getMockFormField(0),
    deployConstructor: {} as AbiConstructor,
    endowment: { ...getMockFormField<BN | null | undefined>(new BN(10000).mul(new BN(10e12))) },
    isLoading: false,
    isUsingSalt: [false, jest.fn(), jest.fn()],
    isUsingStoredMetadata: false,
    metadata: {
      isError: false,
      isSupplied: false,
      isValid: false,
      message: null,
      name: '',
      source: null,
      value: null,
      onChange: jest.fn(),
      onRemove: jest.fn(),
    },
    metadataFile: [undefined, jest.fn()],
    name: getMockFormField('flipper', true),
    onInstantiate: jest.fn(),
    onError: jest.fn(),
    onSuccess: jest.fn(),
    salt: getMockFormField<string>(randomAsHex(), true),
    step: [0, jest.fn(), jest.fn(), jest.fn()],
    weight: {
      executionTime: 0,
      isEmpty: false,
      isValid: true,
      megaGas: new BN(0),
      percentage: 0,
      setIsEmpty: jest.fn(),
      setMegaGas: jest.fn(),
      weight: new BN(0),
    },
    tx: null,
    txError: null,
  };
}
