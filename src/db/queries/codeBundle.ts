// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Database, PrivateKey } from '@textile/threaddb';
import moment from 'moment';
import { getNewCodeBundleId, publicKeyHex } from '../util';
import { findUser } from './user';
import { getCodeBundleCollection, getContractCollection, pushToRemote } from './util';
import type { CodeBundleDocument, MyCodeBundles } from 'types';

export async function findTopCodeBundles(
  db: Database,
  excludeOwnedBy?: PrivateKey | null,
  limit?: number
): Promise<(CodeBundleDocument & { instances: number })[]> {
  try {
    const codeBundles = (
      await getCodeBundleCollection(db)
        .find(excludeOwnedBy ? { owner: { $ne: publicKeyHex(excludeOwnedBy) } } : {})
        .toArray()
    ).slice(0, limit ? limit : undefined);

    return Promise.all(
      codeBundles.map(async codeBundle => {
        const instances = (
          await getContractCollection(db).find({ codeHash: codeBundle.codeHash }).toArray()
        ).length;

        return {
          ...(codeBundle as CodeBundleDocument),
          instances,
        };
      })
    );
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}

export async function findOwnedCodeBundles(
  db: Database,
  identity: PrivateKey | null,
  limit = 2
): Promise<CodeBundleDocument[]> {
  try {
    const user = await findUser(db, identity);

    if (!user) {
      return [];
    }

    return (await getCodeBundleCollection(db).find({ owner: user.publicKey }).toArray()).slice(
      0,
      limit ? limit : undefined
    );
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}

export async function findMyCodeBundles(
  db: Database,
  identity: PrivateKey | null
): Promise<MyCodeBundles> {
  try {
    const user = await findUser(db, identity);

    if (!user) {
      return { owned: [], starred: [] };
    }

    const owned = await findOwnedCodeBundles(db, identity);
    const existingStarred = await getCodeBundleCollection(db)
      .find({ id: { $in: user.codeBundlesStarred } })
      .toArray();

    const starred = user.codeBundlesStarred.map((starredId: string) => {
      const match = existingStarred.find(({ id }) => starredId === id);

      return {
        isExistent: !!match,
        value: match || { identifier: starredId },
      };
    });

    return { owned, starred };
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}

export async function findCodeBundleByHash(
  db: Database,
  codeHash: string
): Promise<CodeBundleDocument | null> {
  return (await getCodeBundleCollection(db).findOne({ codeHash })) || null;
}

export async function findCodeBundleById(
  db: Database,
  id: string
): Promise<CodeBundleDocument | null> {
  return (await getCodeBundleCollection(db).findOne({ id })) || null;
}

export async function searchForCodeBundle(
  db: Database,
  fragment: string
): Promise<CodeBundleDocument[] | null> {
  if (!fragment || fragment === '') {
    return null;
  }

  const matches = await db.dexie
    .table<CodeBundleDocument>('CodeBundle')
    .filter(({ name, codeHash }) => {
      const regex = new RegExp(fragment);

      return regex.test(name) || regex.test(codeHash);
    })
    .limit(10)
    .toArray();

  return matches;
}

export async function createCodeBundle(
  db: Database,
  owner: PrivateKey | null,
  {
    abi,
    codeHash,
    creator,
    genesisHash,
    id = getNewCodeBundleId(),
    instances = 1,
    name,
    stars = 1,
    tags = [],
    date = moment.utc().format(),
  }: Partial<CodeBundleDocument>
): Promise<CodeBundleDocument> {
  try {
    if (!creator) {
      return Promise.reject(new Error('Missing creator address'));
    }

    if (!genesisHash) {
      return Promise.reject(new Error('Missing block genesis hash'));
    }

    if (!codeHash || !name || !genesisHash) {
      return Promise.reject(new Error('Missing codeHash or name'));
    }

    const newCode = getCodeBundleCollection(db).create({
      abi,
      codeHash,
      creator,
      genesisHash,
      id,
      name,
      owner: publicKeyHex(owner),
      tags,
      date,
      stars,
      instances,
    });

    await newCode.save();

    await pushToRemote(db, 'CodeBundle');

    return Promise.resolve(newCode);
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}

export async function updateCodeBundle(
  db: Database,
  id: string,
  { abi, name, tags }: Partial<CodeBundleDocument>
): Promise<string> {
  try {
    const codeBundle = await getCodeBundleCollection(db).findOne({ id });

    if (codeBundle) {
      if (name) codeBundle.name = name;
      if (tags) codeBundle.tags = tags;
      if (abi) codeBundle.abi = abi;

      const id = await codeBundle.save();

      await pushToRemote(db, 'CodeBundle');

      return id;
    }

    return Promise.reject(new Error('Code does not exist'));
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}

export async function removeCodeBundle(db: Database, id: string): Promise<void> {
  try {
    const existing = await findCodeBundleById(db, id);

    if (existing) {
      await getCodeBundleCollection(db).delete(existing._id as string);

      await pushToRemote(db, 'CodeBundle');
    }

    return Promise.resolve();
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}
