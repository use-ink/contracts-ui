// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import type { Database, PrivateKey } from '@textile/threaddb';

import { publicKeyHex } from '../util/identity';
import { getCodeBundleCollection, getContractCollection, getUserCollection, pushToRemote } from './util';
import type { UserDocument } from 'types';

export async function findUser(
  db: Database,
  identity: PrivateKey | null
): Promise<UserDocument | null> {
  if (!identity) return null;

  const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });

  return user || null;
}

export async function getUser(db: Database, identity: PrivateKey | null, { creator, name, email }: Partial<UserDocument> = {}): Promise<UserDocument | null> {
  const existing = await findUser(db, identity);

  if (!identity) {
    // create generic user identity to authorize remote etc.
    return null;
  }

  if (existing) {
    return existing;
  }

  if (!creator) {
    return Promise.reject(new Error('No creator account provided'));
  }

  if (!name) {
    return Promise.reject(new Error('No display name provided'));
  }

  if (identity && !existing) {
    const user = getUserCollection(db)
      .create({
        codeBundlesStarred: [],
        contractsStarred: [],
        creator,
        name,
        email,
        publicKey: publicKeyHex(identity) as string

      })
    await user.save();

    return user;
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
): Promise<number> {
  try {
    if (!identity) {
      return Promise.reject(new Error('No user identity'));
    }

    const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });
    const contract = await getContractCollection(db).findOne({ address });

    if (user && contract) {
      if (!user.contractsStarred.includes(address)) {
        user.contractsStarred.push(address);
      }

      await user.save();

      contract.stars += 1;

      await contract.save();

      await pushToRemote(db, 'Contract', 'User');

      return contract.stars;
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
): Promise<number> {
  try {
    if (!identity) {
      return Promise.reject(new Error('No user identity'));
    }

    const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });
    const contract = await getContractCollection(db).findOne({ address });

    if (user && contract) {
      user.contractsStarred = user.contractsStarred.filter(anAddress => address !== anAddress);

      await user.save();

      contract.stars = Math.max(1, contract.stars - 1);

      await contract.save();

      await pushToRemote(db, 'Contract', 'User');

      return contract.stars;
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
): Promise<number> {
  try {
    if (!identity) {
      return Promise.reject(new Error('No user identity'));
    }

    const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });
    const codeBundle = await getCodeBundleCollection(db).findOne({ id });

    if (user && codeBundle) {
      if (!user.codeBundlesStarred.includes(id)) {
        user.codeBundlesStarred.push(id);
      }

      codeBundle.stars += 1;

      await user.save();
      await codeBundle.save();

      await pushToRemote(db, 'User', 'CodeBundle');

      return codeBundle.stars;
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
): Promise<number> {
  try {
    if (!identity) {
      return Promise.reject(new Error('No user identity'));
    }

    const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });
    const codeBundle = await getCodeBundleCollection(db).findOne({ id });

    if (user && codeBundle) {
      user.codeBundlesStarred = user.codeBundlesStarred.filter(anId => id !== anId);

      codeBundle.stars = Math.max(1, codeBundle.stars - 1);

      await user.save();
      await codeBundle.save();

      await pushToRemote(db, 'User', 'CodeBundle');

      return codeBundle.stars;
    }

    return Promise.reject(new Error('Invalid user'));
  } catch (e) {
    console.error(e);

    return Promise.reject(new Error(e));
  }
}
