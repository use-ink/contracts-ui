// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import { PrivateKey } from '@textile/crypto';
import { ThreadID } from '@textile/threads-id';
import { Database as DB } from '@textile/threaddb';
import type { KeyInfo } from '@textile/hub';
import { codeBundle, contract, user } from '../schemas';

import { createUser } from '../queries/user';
import { getStoredPrivateKey } from './identity';

function isLocalNode(rpcUrl: string): boolean {
  return !rpcUrl.includes('127.0.0.1');
}

export async function init(rpcUrl: string, isRemote = false): Promise<[DB, PrivateKey | null]> {
  const db = await initDb(rpcUrl);
  const identity = await initIdentity(db);

  if (isRemote && !isLocalNode(rpcUrl)) {
    await initRemote(db, identity, rpcUrl);
  }

  return [db, identity];
}

export async function initDb(rpcUrl: string): Promise<DB> {
  const db = await new DB(
    rpcUrl,
    { name: 'User', schema: user },
    { name: 'Contract', schema: contract },
    { name: 'CodeBundle', schema: codeBundle }
  ).open(2);

  return db;
}

export async function initIdentity (db: DB): Promise<PrivateKey> {
  const identity = getStoredPrivateKey();

  await createUser(db, identity);

  return identity;
}

export async function initRemote (db: DB, identity: PrivateKey, rpcUrl: string) {
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



// export function createContractFromDocument (api: ApiPromise, document: ContractDocument): Contract | null {
//   try {
//     const contract = new ContractPromise(api, document.abi, document.address);

//     return [contract, document];
//   } catch (e) {
//     console.error(e);

//     return null;
//   }
// }
