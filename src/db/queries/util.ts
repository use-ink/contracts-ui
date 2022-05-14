// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Collection, Database } from '@textile/threaddb';
import type { CodeBundleDocument, ContractDocument } from 'types';

export function getCodeBundleCollection(db: Database): Collection<CodeBundleDocument> {
  const collection = db.collection<CodeBundleDocument>('CodeBundle');

  if (!collection) throw new Error('Code Bundle collection not found.');

  return collection;
}

export function getContractCollection(db: Database): Collection<ContractDocument> {
  const collection = db.collection<ContractDocument>('Contract');

  if (!collection) throw new Error('Contract collection not found.');

  return collection;
}
