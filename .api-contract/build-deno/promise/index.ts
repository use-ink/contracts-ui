import { Buffer } from 'node:buffer';

import type { ApiPromise } from 'https://deno.land/x/polkadot/api/mod.ts';
import type {
  AccountId,
  AccountId20,
  Hash,
} from 'https://deno.land/x/polkadot/types/interfaces/index.ts';
import type { Abi } from '../Abi/index.ts';

import { toPromiseMethod } from 'https://deno.land/x/polkadot/api/mod.ts';

import {
  Blueprint,
  BlueprintRevive,
  Code,
  CodeRevive,
  Contract,
  ContractRevive,
} from '../base/index.ts';

export class BlueprintPromise extends Blueprint<'promise'> {
  constructor(
    api: ApiPromise,
    abi: string | Record<string, unknown> | Abi,
    codeHash: string | Hash,
  ) {
    super(api, abi, codeHash, toPromiseMethod);
  }
}

export class CodePromise extends Code<'promise'> {
  constructor(
    api: ApiPromise,
    abi: string | Record<string, unknown> | Abi,
    wasm: Uint8Array | string | Buffer | null | undefined,
  ) {
    super(api, abi, wasm, toPromiseMethod);
  }
}

export class ContractPromise extends Contract<'promise'> {
  constructor(
    api: ApiPromise,
    abi: string | Record<string, unknown> | Abi,
    address: string | AccountId,
  ) {
    super(api, abi, address, toPromiseMethod);
  }
}

export class BlueprintRevivePromise extends BlueprintRevive<'promise'> {
  constructor(
    api: ApiPromise,
    abi: string | Record<string, unknown> | Abi,
    codeHash: string | Hash,
  ) {
    super(api, abi, codeHash, toPromiseMethod);
  }
}

export class CodeRevivePromise extends CodeRevive<'promise'> {
  constructor(
    api: ApiPromise,
    abi: string | Record<string, unknown> | Abi,
    wasm: Uint8Array | string | Buffer | null | undefined,
  ) {
    super(api, abi, wasm, toPromiseMethod);
  }
}

export class ContractRevivePromise extends ContractRevive<'promise'> {
  constructor(
    api: ApiPromise,
    abi: string | Record<string, unknown> | Abi,
    address: string | AccountId20,
  ) {
    super(api, abi, address, toPromiseMethod);
  }
}
