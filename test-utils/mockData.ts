import crypto from 'crypto';
import faker from 'faker';
import { Keyring } from '@polkadot/api';
import { contractFiles } from './contracts';
import { getNewCodeBundleId, getPrivateKeyFromPair, publicKeyHex } from 'db';

import { UserDocument, CodeBundleDocument, ContractDocument, KeyringPair, PrivateKey } from 'types';
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

export function getKeyringPairRandom(): KeyringPair {
  return keyring.createFromUri(faker.name.firstName());
}

export function getSecretRandom(): string {
  return crypto.randomBytes(8).toString('hex');
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
      date: new Date().toLocaleString(),
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
      date: new Date().toLocaleString(),
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
