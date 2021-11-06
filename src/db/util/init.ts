// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PrivateKey } from '@textile/crypto';
import { ThreadID } from '@textile/threads-id';
import { Database as DB } from '@textile/threaddb';
import type { KeyInfo } from '@textile/hub';

import { codeBundle, contract, user } from '../schemas';
import { getUser } from '../queries/user';
import { getStoredPrivateKey } from './identity';
import type { UserDocument } from 'types';

const DB_VERSION_KEY = 'substrate-contracts-explorer:db-version';

function isLocalNode(rpcUrl: string): boolean {
  return !rpcUrl.includes('127.0.0.1');
}

export async function init(
  rpcUrl: string,
  isRemote = false
): Promise<[DB, UserDocument | null, PrivateKey | null]> {
  const db = await initDb(rpcUrl);
  const [user, identity] = await initIdentity(db);

  if (isRemote && identity && !isLocalNode(rpcUrl)) {
    await initRemote(db, identity, rpcUrl);
  }

  return [db, user, identity];
}

export async function initDb(rpcUrl: string): Promise<DB> {
  let db: DB;
  let version = parseInt(window.localStorage.getItem(DB_VERSION_KEY) || '1', 10) || 1;
  let isReady = false;

  while (!isReady && version <= 999) {
    try {
      db = await new DB(
        rpcUrl,
        { name: 'User', schema: user },
        { name: 'Contract', schema: contract },
        { name: 'CodeBundle', schema: codeBundle }
      ).open(version);

      window.localStorage.setItem(DB_VERSION_KEY, version.toString());
      isReady = true;
      return db;
    } catch (e) {
      version += 1;
    }
  }

  throw new Error('Unable to initialize database');
}

export async function initIdentity(db: DB): Promise<[UserDocument | null, PrivateKey | null]> {
  const identity = getStoredPrivateKey();

  const user = await getUser(db, identity);

  return [user, identity];
}

export async function initRemote(db: DB, identity: PrivateKey, rpcUrl: string) {
  try {
    if (!process.env.HUB_API_KEY || !process.env.HUB_API_SECRET) {
      throw new Error('No Textile Hub credentials found');
    }

    const info: KeyInfo = {
      key: process.env.HUB_API_KEY,
      secret: process.env.HUB_API_SECRET,
    };

    const remote = await db.remote.setKeyInfo(info);

    await remote.authorize(identity);

    const threadId = ThreadID.fromString(rpcUrl);

    await remote.initialize(threadId);
    await remote.pull('User', 'Contract', 'Code');
  } catch (e) {
    console.error(e);
  }
}
