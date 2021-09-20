import { Database } from '@textile/threaddb';
import { jest } from '@jest/globals';
import BN from 'bn.js';
import { codeBundle, contract, user } from 'db';

import { CanvasState, DbState, InstantiateState, PrivateKey, ApiPromise } from 'types';

export function createMockApi() {
  const api = {
    rpc: { chain: { subscribeNewHeads: jest.fn() } },
  };
  return api as unknown as ApiPromise;
}

export function getMockInstantiateState(): InstantiateState {
  return {
    accountId: ['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', jest.fn(), true, false],
    argValues: [{ initValue: 'true'}, jest.fn()],
    contract: [null, jest.fn()],
    codeHash: '0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d',
    constructorIndex: [0, jest.fn(), false, false],
    endowment: [new BN(0), jest.fn(), false, false],
    events: [[], jest.fn()],
    isLoading: [false, jest.fn(), jest.fn()],
    isSuccess: [false, jest.fn(), jest.fn()],
    isUsingSalt: [false, jest.fn(), jest.fn()],
    isUsingStoredMetadata: [false, jest.fn(), jest.fn()],
    metadata: {
      errorText: null,
      isError: false,
      isSupplied: false,
      isValid: false,
      name: '',
      source: null,
      value: null,
      onChange: jest.fn(),
      onRemove: jest.fn(),
    },
    metadataFile: [undefined, jest.fn()],
    name: ['flipper', jest.fn(), true, false],
    onInstantiate: jest.fn(),
    salt: ['', jest.fn(), false, false],
    step: [0, jest.fn()],
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
  };
}

export function getMockCanvasState(): CanvasState {
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
