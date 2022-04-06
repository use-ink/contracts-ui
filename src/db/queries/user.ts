// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Database, PrivateKey } from '@textile/threaddb';

import { publicKeyHex } from '../util/identity';
import { getCodeBundleCollection, getContractCollection, getUserCollection } from './util';
import type { UserDocument } from 'types';

export async function findUser(
  db: Database,
  identity: PrivateKey | null
): Promise<UserDocument | null> {
  if (!identity) return null;

  const user = await getUserCollection(db).findOne({ publicKey: publicKeyHex(identity) });

  return user || null;
}

export async function getUser(
  db: Database,
  identity: PrivateKey | null,
  { creator, name, email }: Partial<UserDocument> = {}
): Promise<UserDocument | null> {
  const existing = await findUser(db, identity);

  if (!identity) {
    // create generic user identity to authorize remote etc.
    return null;
  }

  if (existing) {
    return existing;
  }

  if (identity && !existing) {
    const user = getUserCollection(db).create({
      codeBundlesStarred: [],
      contractsStarred: [],
      creator,
      name,
      email,
      publicKey: publicKeyHex(identity) as string,
    });
    await user.save();

    return user;
  }

  return Promise.reject(new Error('Unable to create user'));
}

export async function starContract(
  db: Database,
  identity: PrivateKey | null,
  address: string
): Promise<number> {
  try {
    if (!identity) {
      return Promise.reject(new Error('No user identity'));
    }

    const user = await getUserCollection(db).findOne({
      publicKey: publicKeyHex(identity) as string,
    });
    const contract = await getContractCollection(db).findOne({ address });

    if (user && contract) {
      if (!user.contractsStarred.includes(address)) {
        user.contractsStarred.push(address);
      }

      await user.save();

      contract.stars += 1;

      await contract.save();

      return contract.stars;
    }

    return Promise.reject(new Error('Invalid user'));
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
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

    const user = await getUserCollection(db).findOne({
      publicKey: publicKeyHex(identity) as string,
    });
    const contract = await getContractCollection(db).findOne({ address });

    if (user && contract) {
      user.contractsStarred = user.contractsStarred.filter(anAddress => address !== anAddress);

      await user.save();

      contract.stars = Math.max(1, contract.stars - 1);

      await contract.save();

      return contract.stars;
    }

    return Promise.reject(new Error('Invalid user'));
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
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

    const user = await getUserCollection(db).findOne({
      publicKey: publicKeyHex(identity) as string,
    });
    const codeBundle = await getCodeBundleCollection(db).findOne({ id });

    if (user && codeBundle) {
      if (!user.codeBundlesStarred.includes(id)) {
        user.codeBundlesStarred.push(id);
      }

      codeBundle.stars += 1;

      await user.save();
      await codeBundle.save();

      return codeBundle.stars;
    }

    return Promise.reject(new Error('Invalid user'));
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
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

    const user = await getUserCollection(db).findOne({
      publicKey: publicKeyHex(identity) as string,
    });
    const codeBundle = await getCodeBundleCollection(db).findOne({ id });

    if (user && codeBundle) {
      user.codeBundlesStarred = user.codeBundlesStarred.filter(anId => id !== anId);

      codeBundle.stars = Math.max(1, codeBundle.stars - 1);

      await user.save();
      await codeBundle.save();

      return codeBundle.stars;
    }

    return Promise.reject(new Error('Invalid user'));
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}
