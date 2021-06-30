// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import faker from 'faker';
import type { PrivateKey } from '@textile/crypto';
import { getNewCodeBundleId } from '../codeBundle';
import { createPrivateKey, publicKeyHex } from '../identity';
import type { UserDocument, CodeBundleDocument, ContractDocument } from '../../types';

import * as contractFiles from './contracts';
import type { AnyJson } from '@canvas/types';

export const TEST_DATA: [string, number, string[]][] = [
  ['dns', 0, ['alpha', 'beta']], 
  ['erc20', 1, ['alpha', 'beta', 'gamma']], 
  ['flipper', 2, ['delta']], 
  ['incrementer', 1, ['beta', 'delta', 'gamma']], 
];

function randomHash (): string {
  return [...Array(62) as unknown[]].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function getTestUsers (): [UserDocument[], PrivateKey[]] {
  const users: UserDocument[] = [];
  const identities: PrivateKey[] = [];

  TEST_DATA.forEach(() => {
    const identity = createPrivateKey();

    identities.push(identity);

    users.push({
      email: faker.internet.email(),
      name: faker.name.findName(),
      codeBundlesStarred: [],
      contractsStarred: [],
      publicKey: publicKeyHex(identity) as string,
    });
  })

  return [users, identities];
}

export function getTestCodeBundles (): CodeBundleDocument[] {
  const codeBundles: CodeBundleDocument[] = [];

  const blockOneHashes = [randomHash(), randomHash()];
  const genesisHash = randomHash();

  TEST_DATA.forEach(([name, , tags]) => {
    const abi = (contractFiles as Record<string, AnyJson>)[name];

    codeBundles.push({
      blockOneHash: blockOneHashes[Math.round(Math.random())],
      codeHash: randomHash(),
      genesisHash,
      name,
      tags,
      abi,
      id: getNewCodeBundleId(),
    })
  });

  return codeBundles;
}

export function getTestContracts (codeBundles: CodeBundleDocument[]): ContractDocument[] {
  const contracts: ContractDocument[] = [];

  const { blockOneHash, genesisHash, id } = codeBundles[0];
  
  // Original instantiation and 0-2 reinstantiations
  TEST_DATA.forEach(([name, count, tags]) => {
    for (let i = 0; i < 1 + count; i += 1) {
      const abi = (contractFiles as Record<string, AnyJson>)[name];

      contracts.push({
        address: faker.random.alphaNumeric(62),
        blockOneHash,
        genesisHash,
        codeBundleId: id,
        name,
        tags,
        abi,
      })
    }
  });

  return contracts;
}

export function getMockUpdates (withAbi?: boolean) {
  return {
    name: faker.name.jobTitle(),
    tags: ['delta'],
    ...(withAbi ? { abi: Object.values(contractFiles)[3] } : undefined),
  }
}