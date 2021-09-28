import { Database } from '@textile/threaddb';
import { jest } from '@jest/globals';
import BN from 'bn.js';
import { randomAsHex } from '@polkadot/util-crypto';
import { codeBundle, contract, user } from 'db';

import { CanvasState, DbState, PrivateKey, UseFormField, ApiPromise, InstantiateProps, AbiConstructor } from 'types';

export function createMockApi() {
  const api = {
    rpc: { chain: { subscribeNewHeads: jest.fn() } },
  };
  return api as unknown as ApiPromise;
}

export function getMockFormField<T>(value: T | undefined, isValid = false): UseFormField<T> {
  return {
    onChange: jest.fn(),
    value,
    isValid,
    isError: false,
  }
}

export function getMockInstantiateState(): InstantiateProps {
  return {
    accountId: getMockFormField<string | null>('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', true),
    argValues: [{ initValue: 'true'}, jest.fn()],
    codeHash: '0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d',
    constructorIndex: getMockFormField(0),
    deployConstructor: {} as AbiConstructor,
    endowment: { ...getMockFormField<BN | null | undefined>(new BN(10000).mul(new BN(10e12))) },
    isLoading: false,
    isUsingSalt: [false, jest.fn(), jest.fn()],
    isUsingStoredMetadata: [false, jest.fn(), jest.fn()],
    metadata: {
      isError: false,
      isSupplied: false,
      isValid: false,
      validation: null,
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

export function getMockCanvasState(): CanvasState {
  return {
    endpoint: '',
    keyringStatus: null,
    api: createMockApi(),
    error: null,
    status: 'CONNECT_INIT',
    blockZeroHash: '',
    systemName: 'Development',
    systemVersion: '0',
    tokenSymbol: 'Unit',
    tokenDecimals: 12
  } as unknown as CanvasState;
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
    myContracts: null,
    user,
    refreshUserData: () => {},
  };
}
