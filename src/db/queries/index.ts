// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Database } from '@textile/threaddb';
import { getCodeBundleCollection, getContractCollection } from './util';

export async function checkForExpiredDocuments(
  db: Database,
  blockZeroHash: string
): Promise<boolean> {
  const expiredCodes = await getCodeBundleCollection(db)
    .find({ blockZeroHash: { $ne: blockZeroHash } })
    .toArray();
  const expiredContracts = await getContractCollection(db)
    .find({ blockZeroHash: { $ne: blockZeroHash } })
    .toArray();

  return expiredCodes.length > 0 || expiredContracts.length > 0;
}

export async function dropExpiredDocuments(db: Database, blockZeroHash: string): Promise<void> {
  await Promise.all(
    (
      await getCodeBundleCollection(db)
        .find({ blockZeroHash: { $ne: blockZeroHash } })
        .toArray()
    ).map(code => code.remove())
  );
  await Promise.all(
    (
      await getContractCollection(db)
        .find({ blockZeroHash: { $ne: blockZeroHash } })
        .toArray()
    ).map(contract => contract.remove())
  );
}

export * from './codeBundle';
export * from './contract';
export * from './derive';
export * from './user';
export * from './util';
