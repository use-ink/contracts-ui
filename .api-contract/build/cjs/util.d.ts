import type { SubmittableResult } from '@polkadot/api';
import type { EventRecord } from '@polkadot/types/interfaces';
type ContractEvents = 'CodeStored' | 'ContractEmitted' | 'ContractExecution' | 'Instantiated';
export declare function applyOnEvent<T>(
  result: SubmittableResult,
  types: ContractEvents[],
  fn: (records: EventRecord[]) => T,
): T | undefined;
export {};
