// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import type { Collection, Database, PrivateKey } from '@textile/threaddb';
import type { CodeBundleDocument, CodeBundleQuery, MyCodeBundles } from '../types';

import { getNewCodeBundleId, publicKeyHex } from '../util';
import { findUser } from './user';

export function getCodeBundleCollection(db: Database): Collection<CodeBundleDocument> {
  return db.collection('CodeBundle') as Collection<CodeBundleDocument>;
}

export async function findMyCodeBundles(
  db: Database,
  identity: PrivateKey | null
): Promise<MyCodeBundles> {
  const user = await findUser(db, identity);

  if (!user) {
    return { owned: [], starred: [] };
  }

  const owned = await getCodeBundleCollection(db).find({ owner: user.publicKey }).toArray();
  const existingStarred = await getCodeBundleCollection(db)
    .find({ id: { $in: user.codeBundlesStarred } })
    .toArray();

  const starred = user.codeBundlesStarred.map((starredId: string) => {
    const match = existingStarred.find(({ id }) => starredId === id);

    return {
      isExistent: !!match,
      value: match,
    };
  });

  return { owned, starred };
}

export async function findCodeBundleByHash(
  db: Database,
  { codeHash, blockOneHash }: CodeBundleQuery
): Promise<CodeBundleDocument | null> {
  return (await getCodeBundleCollection(db).findOne({ blockOneHash, codeHash })) || null;
}

export async function findCodeBundleById(
  db: Database,
  id: string
): Promise<CodeBundleDocument | null> {
  return (await getCodeBundleCollection(db).findOne({ id })) || null;
}

export async function createCodeBundle(
  db: Database,
  owner: PrivateKey | null,
  { abi, blockOneHash, codeHash, genesisHash, id = getNewCodeBundleId(), name, tags = [] }: Partial<CodeBundleDocument>
): Promise<string> {
  try {
    if (!codeHash || !name || !genesisHash || !owner) {
      return Promise.reject(new Error('Missing codeHash or name'));
    }

    const newCode = getCodeBundleCollection(db).create({
      abi,
      blockOneHash,
      codeHash,
      genesisHash,
      id,
      name,
      owner: publicKeyHex(owner),
      tags,
    });

    await newCode.save();

    return Promise.resolve(id);
  } catch (e) {
    return Promise.reject(new Error(e));
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

      return codeBundle.save();
    }

    return Promise.reject(new Error('Code does not exist'));
  } catch (e) {
    console.error(e);

    return Promise.reject(new Error(e));
  }
}

export async function removeCodeBundle(db: Database, id: string): Promise<void> {
  try {
    const existing = await findCodeBundleById(db, id);

    if (existing) {
      return getCodeBundleCollection(db).delete(existing._id as string);
    }

    return Promise.resolve();
  } catch (e) {
    console.error(e);

    return Promise.reject(new Error(e));
  }
}
