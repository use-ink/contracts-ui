// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Collection, Database } from '@textile/threaddb';
import type { CodeBundleDocument, ContractDocument, UserDocument } from 'types';

export function getCodeBundleCollection(db: Database): Collection<CodeBundleDocument> {
  return db.collection('CodeBundle') as Collection<CodeBundleDocument>;
}

export function getContractCollection(db: Database): Collection<ContractDocument> {
  return db.collection('Contract') as Collection<ContractDocument>;
}

export function getUserCollection(db: Database): Collection<UserDocument> {
  return db.collection('User') as Collection<UserDocument>;
}
