import type { Collection, Database } from "@textile/threaddb";
import type { CodeBundleDocument, ContractDocument, UserDocument } from 'types';

export async function pushToRemote (db: Database, ...collections: string[]): Promise<void> {
  if (db.remote?.id) {
    for (const collection of collections) {
      await db.remote.push(collection);
    }
  }
}

export function getCodeBundleCollection(db: Database): Collection<CodeBundleDocument> {
  return db.collection('CodeBundle') as Collection<CodeBundleDocument>;
}

export function getContractCollection(db: Database): Collection<ContractDocument> {
  return db.collection('Contract') as Collection<ContractDocument>;
}

export function getUserCollection(db: Database): Collection<UserDocument> {
  return db.collection('User') as Collection<UserDocument>;
}
