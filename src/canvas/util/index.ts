// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import type { DispatchError, ApiPromise, StorageEntry } from '../types';

export async function getCodeHashes(api: ApiPromise): Promise<string[]> {
  let codeHashes: string[] = [];
  try {
    const entries = await api.query.contracts.codeStorage.entries();
    codeHashes = extractCodeHashes(entries);
  } catch (error) {
    console.log(error);
  }
  return codeHashes;
}

export function extractCodeHashes(entries: StorageEntry[]): string[] {
  return (
    entries
      ?.filter(entry => entry[1].isSome === true)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map(validEntry => validEntry[0].toHuman()!.toString())
  );
}

export function handleDispatchError(dispatchError: DispatchError, api: ApiPromise): void {
  if (dispatchError.isModule) {
    const decoded = api.registry.findMetaError(dispatchError.asModule);
    console.log('Error creating instance: ', decoded);
  } else {
    console.log(`Error creating instance: ${dispatchError}`);
  }
}
