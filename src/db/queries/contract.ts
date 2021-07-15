// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

// import { keyring } from '@polkadot/ui-keyring';
import type { Collection, Database, PrivateKey } from '@textile/threaddb';

import { publicKeyHex } from '../util';

import { findUser } from './user';
import { getCodeBundleCollection } from './codeBundle';
import { pushToRemote } from './util';

import type { ContractDocument, MyContracts } from 'types';

export function getContractCollection(db: Database): Collection<ContractDocument> {
  return db.collection('Contract') as Collection<ContractDocument>;
}

export async function findMyContracts(
  db: Database,
  identity: PrivateKey | null
): Promise<MyContracts> {
  const user = await findUser(db, identity);

  if (!user) {
    return { owned: [], starred: [] };
  }

  const owned = await getContractCollection(db).find({ owner: user.publicKey }).toArray();
  const existingStarred = await getContractCollection(db)
    .find({ address: { $in: user.contractsStarred } })
    .toArray();

  const starred = user.contractsStarred.map((starredAddress: string) => {
    const match = existingStarred.find(({ address }) => starredAddress === address);

    return {
      isExistent: !!match,
      value: match || { identifier: starredAddress },
    };
  });

  return { owned, starred };
}

export async function findContractByAddress(
  db: Database,
  address: string
): Promise<ContractDocument | null> {
  return (await getContractCollection(db).findOne({ address })) || null;
}

export async function createContract(
  db: Database,
  owner: PrivateKey | null,
  { abi, address, blockOneHash, codeBundleId, genesisHash, name, tags = [] }: Partial<ContractDocument>
): Promise<string> {
  try {
    if (!address || !codeBundleId || !name || !genesisHash || !blockOneHash) {
      return Promise.reject(new Error('Missing address or name'));
    }

    if (!(await getCodeBundleCollection(db).findOne({ id: codeBundleId }))) {
      return Promise.reject(new Error('Instantiation code bundle is invalid'));
    }

    if (await getContractCollection(db).findOne({ address })) {
      return Promise.reject(new Error('Contract already exists'));
    }

    const newContract = getContractCollection(db).create({
      abi,
      address,
      blockOneHash,
      codeBundleId,
      genesisHash,
      name,
      owner: publicKeyHex(owner),
      tags,
    });

    // keyring.saveContract(address, {
    //   contract: {
    //     abi: abi || undefined,
    //     genesisHash,
    //   },
    //   name,
    //   tags: [],
    // });

    await newContract.save();

    await pushToRemote(db, 'Contract');

    return Promise.resolve(address);
  } catch (e) {
    console.error(new Error(e));

    return Promise.reject(new Error(e));
  }
}

export async function updateContract(
  db: Database,
  address: string,
  { name, tags }: Partial<ContractDocument>
): Promise<string> {
  try {
    const contract = await getContractCollection(db).findOne({ address });

    if (contract) {
      if (name) contract.name = name;
      if (tags) contract.tags = tags;

      const id = await contract.save();

      await pushToRemote(db, 'Contract');

      return id;
    }

    return Promise.reject(new Error('Contract does not exist'));
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}

export async function removeContract(db: Database, address: string): Promise<void> {
  try {
    const existing = await findContractByAddress(db, address);

    // keyring.forgetContract(address);

    if (existing) {
      await getContractCollection(db).delete(existing._id as string);

      await pushToRemote(db, 'Contract');
    }

    return Promise.resolve();
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
