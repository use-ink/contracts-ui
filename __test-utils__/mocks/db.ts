// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Database } from '@textile/threaddb';
import faker from 'faker';
import moment from 'moment';
import { contractFiles } from '../contracts';
import { getKeyringPairRandom, getSecretRandom } from './keyring';
import {
  codeBundle,
  contract,
  user,
  getNewCodeBundleId,
  getPrivateKeyFromPair,
  publicKeyHex,
} from 'db';

import type {
  UserDocument,
  CodeBundleDocument,
  ContractDocument,
  PrivateKey,
  AnyJson,
} from 'types';
import { MOCK_CONTRACT_DATA } from 'ui/util';

type TestUser = [UserDocument, PrivateKey];

function randomHash(): string {
  return [...(Array(62) as unknown[])]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
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

  const blockZeroHashes = [randomHash(), randomHash()];
  const genesisHash = randomHash();

  MOCK_CONTRACT_DATA.forEach(([name, , tags]) => {
    const abi = (contractFiles as Record<string, AnyJson>)[name.toLowerCase()];

    codeBundles.push({
      blockZeroHash: blockZeroHashes[Math.round(Math.random())],
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

  const { blockZeroHash, creator, genesisHash } = codeBundles[0];

  // Original instantiation and 0-2 reinstantiations
  MOCK_CONTRACT_DATA.forEach(([name, , tags], index) => {
    const abi = (contractFiles as Record<string, AnyJson>)[name.toLowerCase()];

    contracts.push({
      address: faker.random.alphaNumeric(62),
      blockZeroHash,
      creator,
      genesisHash,
      codeHash: codeBundles[index].codeHash,
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
