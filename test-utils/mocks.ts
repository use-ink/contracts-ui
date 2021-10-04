import crypto from 'crypto';
import { Database } from '@textile/threaddb';
import faker from 'faker';
import { keyring } from '@polkadot/ui-keyring';
import { jest } from '@jest/globals';
import moment from 'moment';
import { contractFiles } from './contracts';
// import { mockApi, mockDb } from './mockContexts';
import { codeBundle, contract, user, getNewCodeBundleId, getPrivateKeyFromPair, publicKeyHex } from 'db';

import { UserDocument, CodeBundleDocument, ContractDocument, KeyringPair, PrivateKey, DbState, ApiPromise, InstantiateState, Abi } from 'types';
import { MOCK_CONTRACT_DATA } from 'ui/util';
import { LOCAL_NODE } from 'ui/contexts';

type TestUser = [UserDocument, PrivateKey];

keyring.loadAll({ isDevelopment: true });

function randomHash(): string {
  return [...(Array(62) as unknown[])]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
}

export const mockKeyring = keyring;

export const mockInvalidAddress = '15QbBVsKoTnshpY7tvntziYYSTD2FyUR15xPiMdpkpJDUygh';

export function getKeyringPairRandom(): KeyringPair {
  return mockKeyring.createFromUri(faker.name.firstName());
}

export function getSecretRandom(): string {
  return crypto.randomBytes(8).toString('hex');
}

export function getMockDbUser(): TestUser {
  const pair = getKeyringPairRandom();
  const secret = getSecretRandom();
  const identity = getPrivateKeyFromPair(pair, secret);

  return [
    {
      email: faker.internet.email(),
      name: faker.name.findName(),
      codeBundlesStarred: [],
      creator: pair.address,
      contractsStarred: [],
      publicKey: publicKeyHex(identity) as string,
    },
    identity,
  ];
}

export const mockDbUser = getMockDbUser();

export function getMockDbUsers(count: number): TestUser[] {
  const result: TestUser[] = [mockDbUser];

  for (let i = 0; i < count - 1; i++) {
    result.push(getMockDbUser());
  }

  return result;
}

export function getMockCodeBundles(): CodeBundleDocument[] {
  const codeBundles: CodeBundleDocument[] = [];

  const blockOneHashes = [randomHash(), randomHash()];
  const genesisHash = randomHash();

  MOCK_CONTRACT_DATA.forEach(([name, , tags]) => {
    const abi = (contractFiles as Record<string, Record<string, unknown>>)[name];

    codeBundles.push({
      blockOneHash: blockOneHashes[Math.round(Math.random())],
      codeHash: randomHash(),
      creator: getKeyringPairRandom().address,
      genesisHash,
      name,
      tags,
      abi,
      id: getNewCodeBundleId(),
      date: moment().format(),
      stars: 1,
      instances: 0,
    });
  });

  return codeBundles;
}

export function getMockContracts(codeBundles: CodeBundleDocument[]): ContractDocument[] {
  const contracts: ContractDocument[] = [];

  const { blockOneHash, creator, genesisHash } = codeBundles[0];

  // Original instantiation and 0-2 reinstantiations
  MOCK_CONTRACT_DATA.forEach(([name, , tags], index) => {
    const abi = (contractFiles as Record<string, Record<string, unknown>>)[name.toLowerCase()];

    contracts.push({
      address: faker.random.alphaNumeric(62),
      blockOneHash,
      creator,
      genesisHash,
      codeBundleId: codeBundles[index].id,
      name,
      tags,
      abi,
      date: moment().format(),
      stars: 1,
    });
  });

  return contracts;
}

export function getMockDbUpdates(withAbi?: boolean) {
  return {
    name: faker.name.jobTitle(),
    tags: ['delta'],
    ...(withAbi ? { abi: Object.values(contractFiles)[3] } : undefined),
  };
}

export async function getMockDb() {
  const db = await new Database(
    'test',
    { name: 'User', schema: user },
    { name: 'Contract', schema: contract },
    { name: 'CodeBundle', schema: codeBundle }
  ).open(1);

  return db;
}

export const mockDbState = {
  db: undefined,
  isDbReady: true,
  identity: mockDbUser[1],
  user: mockDbUser[0],
  refreshUser: jest.fn()
} as unknown as DbState;

export async function getMockDbStateFull (): Promise<DbState> {
  const [user, identity] = mockDbUser;

  const state = {
    db: await getMockDb(),
    isDbReady: true,
    identity,
    user,
    refreshUser: jest.fn()
  } as unknown as DbState;

  return state;
}

// export const mockKeyring = {
//   createFromUri: jest.fn().mockImplementation(
    
//   ),
//   getAccounts: jest.fn().mockReturnValue(
//     keyringPairsMock as KeyringAddress[]
//   ),
//   getAccount: jest.fn().mockImplementation(
//     (...args: unknown[]): KeyringAddress | undefined => {
//       const found = keyringPairsMock.find((pair) => pair.address === args[0]);

//       return found as KeyringAddress || undefined;
//     }
//   ),
//   getPair: jest.fn().mockImplementation(
//     (...args: unknown[]): KeyringPair | undefined => {
//       const found = keyringPairsMock.find((pair) => pair.address === args[0]);

//       return found as unknown as KeyringPair || undefined;
//     }
//   )
// } as unknown as Keyring;

export const mockApi = {
  rpc: { chain: { subscribeNewHeads: jest.fn() } },
} as unknown as ApiPromise;

export const mockCanvasState = {
  api: mockApi,
  endpoint: LOCAL_NODE,
  keyring: mockKeyring,
  keyringStatus: 'READY',
  status: 'READY'
} as unknown as CanvasState;

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
}

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
