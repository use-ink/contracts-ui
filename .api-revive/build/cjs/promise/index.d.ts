import type { ApiPromise } from '@polkadot/api';
import type { AccountId20, Hash } from '@polkadot/types/interfaces';
import type { Abi } from '../Abi/index.js';
import { Blueprint, Code, Contract } from '../base/index.js';
export declare class BlueprintPromise extends Blueprint<'promise'> {
  constructor(
    api: ApiPromise,
    abi: string | Record<string, unknown> | Abi,
    codeHash: string | Hash,
  );
}
export declare class CodePromise extends Code<'promise'> {
  constructor(
    api: ApiPromise,
    abi: string | Record<string, unknown> | Abi,
    wasm: Uint8Array | string | Buffer | null | undefined,
  );
}
export declare class ContractPromise extends Contract<'promise'> {
  constructor(
    api: ApiPromise,
    abi: string | Record<string, unknown> | Abi,
    address: string | AccountId20,
  );
}
