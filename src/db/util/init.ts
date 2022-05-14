// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Database as DB } from '@textile/threaddb';

import { codeBundle, contract, user } from '../schemas';

const DB_VERSION_KEY = 'contracts-ui:db-version';
const LOCAL_NODE_DB_NAME = 'contracts-ui:local-db-name';

function isLocalNode(rpcUrl: string): boolean {
  return rpcUrl.includes('127.0.0.1');
}

export async function init(rpcUrl: string): Promise<DB> {
  const name = `${rpcUrl}`;

  const db = await initDb(name);

  if (isLocalNode(rpcUrl)) {
    window.localStorage.setItem(LOCAL_NODE_DB_NAME, name);
  }

  return db;
}

export async function initDb(name: string): Promise<DB> {
  window.localStorage.removeItem(DB_VERSION_KEY);

  let db: DB;
  let version = 0;
  let isReady = false;

  while (!isReady && version <= 999) {
    try {
      db = await new DB(
        name,
        { name: 'User', schema: user },
        { name: 'Contract', schema: contract },
        { name: 'CodeBundle', schema: codeBundle }
      ).open(version);

      isReady = true;
      return db;
    } catch (e) {
      version += 1;
    }
  }

  throw new Error('Unable to initialize database');
}
