import type { Database } from "@textile/threaddb";

export async function pushToRemote (db: Database, collection: string): Promise<void> {
  if (db.remote?.id) {
    await db.remote.push(collection);
  }
}