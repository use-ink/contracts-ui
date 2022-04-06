// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Database, PrivateKey } from '@textile/threaddb';

import { publicKeyHex } from '../util/identity';
import { getUserCollection } from './util';
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
