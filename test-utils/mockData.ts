import crypto from 'crypto';
import faker from 'faker';
import { Keyring } from '@polkadot/api';
import moment from 'moment';
import { Database } from '@textile/threaddb';
import { contractFiles } from './contracts';
import { createMockApi } from './utils';
import {
  getNewCodeBundleId,
  getPrivateKeyFromPair,
  publicKeyHex,
  codeBundle,
  contract,
  user,
} from 'db';

import {
  CanvasState,
  DbState,
  InstantiateState,
  UserDocument,
  CodeBundleDocument,
  ContractDocument,
  AnyJson,
  KeyringPair,
  PrivateKey,
} from 'types';
import { MOCK_CONTRACT_DATA } from 'ui/util';

type TestUser = [UserDocument, PrivateKey];

const keyring = new Keyring();

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
};
export const flipperMockJson: AnyJson = {
  metadataVersion: '0.1.0',
  source: {
    hash: '0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d',
    language: 'ink! 3.0.0-rc3',
    compiler: 'rustc 1.53.0-nightly',
  },
  contract: {
    name: 'flipper',
    version: '3.0.0-rc3',
    authors: ['Parity Technologies <admin@parity.io>'],
  },
  spec: {
    constructors: [
      {
        args: [
          {
            name: 'init_value',
            type: {
              displayName: ['bool'],
              type: 1,
            },
          },
        ],
        docs: ['Creates a new flipper smart contract initialized with the given value.'],
        name: ['new'],
        selector: '0x9bae9d5e',
      },
      {
        args: [],
        docs: ['Creates a new flipper smart contract initialized to `false`.'],
        name: ['default'],
        selector: '0xed4b9d1b',
      },
    ],
    docs: [],
    events: [],
    messages: [
      {
        args: [],
        docs: [" Flips the current value of the Flipper's bool."],
        mutates: true,
        name: ['flip'],
        payable: false,
        returnType: null,
        selector: '0x633aa551',
      },
      {
        args: [],
        docs: [" Returns the current value of the Flipper's bool."],
        mutates: false,
        name: ['get'],
        payable: false,
        returnType: {
          displayName: ['bool'],
          type: 1,
        },
        selector: '0x2f865bd9',
      },
    ],
  },
  storage: {
    struct: {
      fields: [
        {
          layout: {
            cell: {
              key: '0x0000000000000000000000000000000000000000000000000000000000000000',
              ty: 1,
            },
          },
          name: 'value',
        },
      ],
    },
  },
  types: [
    {
      def: {
        primitive: 'bool',
      },
    },
  ],
};

export function getKeyringPairRandom(): KeyringPair {
  return keyring.createFromUri(faker.name.firstName());
}

export function getSecretRandom(): string {
  return crypto.randomBytes(8).toString('hex');
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

export function getMockCanvasState(): CanvasState {
  return {
    endpoint: '',
    keyring: null,
    keyringStatus: null,
    api: createMockApi(),
    error: null,
    status: null,
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

function randomHash(): string {
  return [...(Array(62) as unknown[])]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
}

export function getTestUser(): TestUser {
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

export function getTestUsers(count: number): TestUser[] {
  const result: TestUser[] = [];

  for (let i = 0; i < count; i++) {
    result.push(getTestUser());
  }

  return result;
}

export function getTestCodeBundles(): CodeBundleDocument[] {
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

export function getTestContracts(codeBundles: CodeBundleDocument[]): ContractDocument[] {
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

export function getMockUpdates(withAbi?: boolean) {
  return {
    name: faker.name.jobTitle(),
    tags: ['delta'],
    ...(withAbi ? { abi: Object.values(contractFiles)[3] } : undefined),
  };
}
