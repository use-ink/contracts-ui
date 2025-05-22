import type { SubmittableResult } from 'https://deno.land/x/polkadot/api/mod.ts';
import type { EventRecord } from 'https://deno.land/x/polkadot/types/interfaces/index.ts';

type ContractEvents = 'CodeStored' | 'ContractEmitted' | 'ContractExecution' | 'Instantiated';

export function applyOnEvent<T>(
  result: SubmittableResult,
  types: ContractEvents[],
  fn: (records: EventRecord[]) => T,
): T | undefined {
  if (result.isInBlock || result.isFinalized) {
    const records = result.filterRecords('contracts', types);

    if (records.length) {
      return fn(records);
    }
  }

  return undefined;
}
