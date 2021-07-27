// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { Database } from '@textile/threaddb';
import { getCodeBundleCollection, getContractCollection } from './util';

export async function checkForExpiredDocuments(
  db: Database,
  blockOneHash: string
): Promise<boolean> {
  const expiredCodes = await getCodeBundleCollection(db)
    .find({ blockOneHash: { $ne: blockOneHash } })
    .toArray();
  const expiredContracts = await getContractCollection(db)
    .find({ blockOneHash: { $ne: blockOneHash } })
    .toArray();

  return expiredCodes.length > 0 || expiredContracts.length > 0;
}

export async function dropExpiredDocuments(db: Database, blockOneHash: string): Promise<void> {
  await Promise.all(
    (
      await getCodeBundleCollection(db)
        .find({ blockOneHash: { $ne: blockOneHash } })
        .toArray()
    ).map(code => code.remove())
  );
  await Promise.all(
    (
      await getContractCollection(db)
        .find({ blockOneHash: { $ne: blockOneHash } })
        .toArray()
    ).map(contract => contract.remove())
  );
}

export * from './codeBundle';
export * from './contract';
export * from './user';
export * from './util';