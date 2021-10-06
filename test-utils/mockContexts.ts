// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Database } from '@textile/threaddb';
import { jest } from '@jest/globals';
import { codeBundle, contract, user } from 'db';

import { ApiState, DbState, InstantiateState, PrivateKey, ApiPromise } from 'types';

export function createMockApi() {
  const api = {
    rpc: { chain: { subscribeNewHeads: jest.fn() } },
  };
  return api as unknown as ApiPromise;
}

export function getMockInstantiateState(): InstantiateState {
  return {
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
}

export function getMockApiState(): ApiState {
  return {
    endpoint: '',
    keyring: null,
    keyringStatus: null,
    api: createMockApi(),
    error: null,
    status: 'CONNECT_INIT',
    blockOneHash: '',
    systemName: 'Development',
    systemVersion: '0',
  };
}

async function createMockDb() {
  const db = await new Database(
    'test',
    { name: 'User', schema: user },
    { name: 'Contract', schema: contract },
    { name: 'CodeBundle', schema: codeBundle }
  ).open(1);
  return db;
}

export async function getMockDbState(): Promise<DbState> {
  const user = {
    email: 'name@email.com',
    name: 'Jane Doe',
    codeBundlesStarred: [],
    creator: 'test',
    contractsStarred: [],
    publicKey: 'test',
  };
  const identity = {} as PrivateKey;

  return {
    db: await createMockDb(),
    isDbReady: true,
    identity,
    user,
    refreshUser: () => {},
  };
}
