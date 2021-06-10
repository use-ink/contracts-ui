// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import faker from 'faker';
import type { PrivateKey } from '@textile/crypto';
import { getNewCodeBundleId } from '../codeBundle';
import { createPrivateKey, publicKeyHex } from '../identity';
import type { UserDocument, CodeBundleDocument, ContractDocument } from '../../types';

import * as contractFiles from './contracts';
import { chooseMany, chooseOne } from '@common/util/testing';

const TAGS = ['alpha', 'beta', 'delta', 'gamma'];

function randomHash (): string {
  return [...Array(62) as unknown[]].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function getTestUsers (length: number): [UserDocument[], PrivateKey[]] {
  const users: UserDocument[] = [];
  const identities: PrivateKey[] = [];

  Array.from({ length }, () => {
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

  Object.entries(contractFiles).forEach(([name, abi]) => {
    codeBundles.push({
      blockOneHash: blockOneHashes[Math.round(Math.random())],
      codeHash: randomHash(),
      genesisHash,
      name,
      tags: chooseMany<string>(TAGS),
      abi,
      id: getNewCodeBundleId(),
    })
  });

  return codeBundles;
}

export function getTestContracts (codeBundles: CodeBundleDocument[]): ContractDocument[] {
  const contracts: ContractDocument[] = [];

  const [{ blockOneHash, genesisHash, id }] = chooseOne(codeBundles);
  
  Object.entries(contractFiles).forEach(([name, abi]) => {
    contracts.push({
      address: faker.random.alphaNumeric(62),
      blockOneHash,
      genesisHash,
      codeBundleId: id,
      name,
      tags: chooseMany<string>(TAGS),
      abi,
    })
  });

  return contracts;
}