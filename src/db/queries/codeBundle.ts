// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Database } from '@textile/threaddb';
import { getNewCodeBundleId } from '../util';
import { getCodeBundleCollection } from './util';
import type { CodeBundleDocument } from 'types';

export async function findOwnedCodeBundles(db: Database, limit = 2): Promise<CodeBundleDocument[]> {
  try {
    return (await getCodeBundleCollection(db).find({}).toArray()).slice(
      0,
      limit ? limit : undefined
    );
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
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
  {
    abi,
    codeHash,
    creator,
    id = getNewCodeBundleId(),
    instances = 1,
    name,
    tags = [],
    date = new Date().toISOString(),
  }: Partial<CodeBundleDocument>
): Promise<CodeBundleDocument> {
  try {
    if (!creator) {
      return Promise.reject(new Error('Missing creator address'));
    }

    if (!codeHash || !name) {
      return Promise.reject(new Error('Missing codeHash or name'));
    }

    const newCode = getCodeBundleCollection(db).create({
      abi,
      codeHash,
      creator,
      id,
      name,
      tags,
      date,
      instances,
    });

    await newCode.save();

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

      return id;
    }

    return Promise.reject(new Error('Code does not exist'));
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}

export async function removeCodeBundle(db: Database, codeHash: string): Promise<void> {
  try {
    const existing = await getCodeBundleCollection(db).findOne({ codeHash });

    if (existing) {
      await getCodeBundleCollection(db).delete(existing._id);
    }

    return Promise.resolve();
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}
