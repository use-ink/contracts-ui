// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import type { Collection, Database, PrivateKey } from '@textile/threaddb';

import { publicKeyHex } from '../util/identity';

import type { UserDocument } from '../types';
import { pushToRemote } from './util';

export function getUserCollection(db: Database): Collection<UserDocument> {
  return db.collection('User') as Collection<UserDocument>;
}

export async function findUser(
  db: Database,
  identity: PrivateKey | null
): Promise<UserDocument | null> {
  if (!identity) return null;

  const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });

  return user || null;
}

export async function createUser(db: Database, identity: PrivateKey | null, { name, email }: Partial<UserDocument> = {}): Promise<string> {
  const existing = await findUser(db, identity);

  if (identity && !existing) {
    return getUserCollection(db)
      .create({
        codeBundlesStarred: [],
        contractsStarred: [],
        name,
        email,
        publicKey: Buffer.from(identity.pubKey).toString('hex'),

      })
      .save();
  }

  return Promise.reject(new Error('Unable to create user'));
}

// export async function updateUser (db: Database, identity: PrivateKey, { codeBundlesStarred, contractsStarred }: Partial<UserDocument>): Promise<string> {
//   const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });

//   if (user) {
//     if (codeBundlesStarred) user.codeBundlesStarred = codeBundlesStarred;
//     if (contractsStarred) user.contractsStarred = contractsStarred;

//     return user.save();
//   }

//   return Promise.reject(new Error('Invalid user'));
// }

export async function starContract(
  db: Database,
  identity: PrivateKey | null,
  address: string
): Promise<string> {
  try {
    if (!identity) {
      return Promise.reject(new Error('No user identity'));
    }

    const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });

    if (user) {
      if (!user.contractsStarred.includes(address)) {
        user.contractsStarred.push(address);
      }

      const id = await user.save();

      await pushToRemote(db, 'User');

      return id;
    }

    return Promise.reject(new Error('Invalid user'));
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}

export async function unstarContract(
  db: Database,
  identity: PrivateKey | null,
  address: string
): Promise<string> {
  try {
    if (!identity) {
      return Promise.reject(new Error('No user identity'));
    }

    const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });

    if (user) {
      user.contractsStarred = user.contractsStarred.filter(anAddress => address !== anAddress);

      const id = await user.save();

      await pushToRemote(db, 'User');

      return id;
    }

    return Promise.reject(new Error('Invalid user'));
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}

export async function starCodeBundle(
  db: Database,
  identity: PrivateKey | null,
  id: string
): Promise<string> {
  try {
    if (!identity) {
      return Promise.reject(new Error('No user identity'));
    }

    const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });

    if (user) {
      if (!user.codeBundlesStarred.includes(id)) {
        user.codeBundlesStarred.push(id);
      }

      const _id = await user.save();

      await pushToRemote(db, 'User');

      return _id;
    }

    return Promise.reject(new Error('Invalid user'));
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}

export async function unstarCodeBundle(
  db: Database,
  identity: PrivateKey | null,
  id: string
): Promise<string> {
  try {
    if (!identity) {
      return Promise.reject(new Error('No user identity'));
    }

    const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });

    if (user) {
      user.codeBundlesStarred = user.codeBundlesStarred.filter(anId => id !== anId);

      const _id = await user.save();

      await pushToRemote(db, 'User');

      return _id;
    }

    return Promise.reject(new Error('Invalid user'));
  } catch (e) {
    console.error(e);

    return Promise.reject(new Error(e));
  }
}
