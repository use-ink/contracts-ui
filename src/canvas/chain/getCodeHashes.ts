/// this file will be removed soon

import type { StorageKey, Option, CodeHash, PrefabWasmModule, ApiPromise } from '../../types';

type StorageEntry = [StorageKey<[CodeHash]>, Option<PrefabWasmModule>];

export function extractCodeHashes(entries: StorageEntry[]): string[] {
  return (
    entries
      ?.filter(entry => entry[1].isSome === true)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map(validEntry => validEntry[0].toHuman()!.toString())
  );
}
export async function getCodeHashes(api: ApiPromise) {
  let codeHashes: string[] = [];
  try {
    const entries = await api.query.contracts.codeStorage.entries();
    codeHashes = extractCodeHashes(entries);
  } catch (error) {
    console.log(error);
  }
  return codeHashes;
}
