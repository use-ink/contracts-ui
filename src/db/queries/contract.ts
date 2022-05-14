// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Database } from '@textile/threaddb';
import { keyring } from '@polkadot/ui-keyring';
import { getCodeBundleCollection, getContractCollection } from './util';
import { createCodeBundle } from './codeBundle';
import type { ContractDocument } from 'types';

export async function findContractByAddress(
  db: Database,
  address: string
): Promise<ContractDocument | null> {
  return (await getContractCollection(db).findOne({ address })) || null;
}

export async function createContract(
  db: Database,
  {
    abi,
    address,
    codeHash,
    creator,
    date = new Date().toISOString(),
    name,
    tags = [],
  }: Partial<ContractDocument>,
  savePair = true
): Promise<ContractDocument> {
  try {
    if (!abi || !address || !codeHash || !creator || !name) {
      return Promise.reject(new Error('Missing required fields'));
    }

    if (await getContractCollection(db).findOne({ address })) {
      return Promise.reject(new Error('Contract already exists'));
    }

    const exists = await getCodeBundleCollection(db).findOne({ codeHash });

    if (!exists) {
      await createCodeBundle(db, {
        abi,
        codeHash,
        creator,
        name,
        tags: [],
        date,
        instances: 1,
      });
    } else {
      exists.instances += 1;

      await exists.save();
    }

    const newContract = getContractCollection(db).create({
      abi,
      address,
      codeHash,
      creator,
      name,
      tags,
      date,
    });

    savePair && keyring.saveContract(address, { name, tags, abi });

    await newContract.save();

    return Promise.resolve(newContract);
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}

export async function updateContract(
  db: Database,
  address: string,
  { name, tags }: Partial<ContractDocument>,
  savePair = true
): Promise<string> {
  try {
    const contract = await getContractCollection(db).findOne({ address });

    if (contract) {
      if (name) contract.name = name;
      if (tags) contract.tags = tags;

      savePair &&
        keyring.saveContract(address, {
          ...(keyring.getContract(address)?.meta || {}),
          name,
          tags,
        });

      const id = await contract.save();

      return id;
    }

    return Promise.reject(new Error('Contract does not exist'));
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}

export async function removeContract(
  db: Database,
  address: string,
  savePair = true
): Promise<void> {
  try {
    const existing = await findContractByAddress(db, address);

    keyring.forgetContract(address);

    if (existing) {
      await getContractCollection(db).delete(existing._id as string);

      savePair && keyring.forgetContract(address);
    }

    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}
