import faker from 'faker';
import type { PrivateKey } from '@textile/crypto';
import moment from 'moment';
import * as contractFiles from './contracts';
import { createMockApi } from './utils';
import { getNewCodeBundleId, getPrivateKeyRandom, initDb, publicKeyHex } from 'db';
import { CanvasState, DbState, InstantiateState , UserDocument, CodeBundleDocument, ContractDocument, AnyJson } from 'types';
import { MOCK_CONTRACT_DATA } from 'ui/util';

type TestUser = [UserDocument, PrivateKey];

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

export function getMockInstantiateState (): InstantiateState {
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
  }
};

export function getMockCanvasState (): CanvasState {
  return {
    endpoint: '',
    keyring: null,
    keyringStatus: null,
    api: createMockApi(),
    error: null,
    status: null,
    blockOneHash: '',
    systemName: 'Development',
    systemVersion: '0'
  }
};

export async function getMockDbState (): Promise<DbState> {
  const [user, identity] = getTestUser();

  return {
    db: (await initDb('test')),
    isDbReady: true,
    identity,
    user,
    refreshUser: () => {}
  }
}


function randomHash(): string {
  return [...(Array(62) as unknown[])]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
}

export function getTestUser (): TestUser {
  const identity = getPrivateKeyRandom();

  return [
    {
      email: faker.internet.email(),
      name: faker.name.findName(),
      codeBundlesStarred: [],
      contractsStarred: [],
      publicKey: publicKeyHex(identity) as string,
    },
    identity
  ];
}

export function getTestUsers (count: number): TestUser[] {
  const result: TestUser[] = [];

  for (let i = 0; i < count; i++) {
    const identity = getPrivateKeyRandom();

    result.push([
      {
        email: faker.internet.email(),
        name: faker.name.findName(),
        codeBundlesStarred: [],
        contractsStarred: [],
        publicKey: publicKeyHex(identity) as string,
      },
      identity
    ]);
  }

  return result;
}

export function getTestCodeBundles(): CodeBundleDocument[] {
  const codeBundles: CodeBundleDocument[] = [];

  const blockOneHashes = [randomHash(), randomHash()];
  const genesisHash = randomHash();

  MOCK_CONTRACT_DATA.forEach(([name, , tags]) => {
    const abi = (contractFiles as Record<string, AnyJson>)[name];

    codeBundles.push({
      blockOneHash: blockOneHashes[Math.round(Math.random())],
      codeHash: randomHash(),
      genesisHash,
      name,
      tags,
      abi,
      id: getNewCodeBundleId(),
      date: moment().format(),
      stars: 1,
      instances: 0
    });
  });

  return codeBundles;
}

export function getTestContracts(codeBundles: CodeBundleDocument[]): ContractDocument[] {
  const contracts: ContractDocument[] = [];

  const { blockOneHash, genesisHash } = codeBundles[0];

  // Original instantiation and 0-2 reinstantiations
  MOCK_CONTRACT_DATA.forEach(([name, , tags], index) => {
    const abi = (contractFiles as Record<string, AnyJson>)[name.toLowerCase()];

    contracts.push({
      address: faker.random.alphaNumeric(62),
      blockOneHash,
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
