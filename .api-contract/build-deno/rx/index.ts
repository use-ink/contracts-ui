import { Buffer } from 'node:buffer';

import type { ApiRx } from 'https://deno.land/x/polkadot/api/mod.ts';
import type { AccountId, Hash } from 'https://deno.land/x/polkadot/types/interfaces/index.ts';
import type { Abi } from '../Abi/index.ts';

import { toRxMethod } from 'https://deno.land/x/polkadot/api/mod.ts';

import { Blueprint, Code, Contract } from '../base/index.ts';

export class BlueprintRx extends Blueprint<'rxjs'> {
  constructor(api: ApiRx, abi: string | Record<string, unknown> | Abi, codeHash: string | Hash) {
    super(api, abi, codeHash, toRxMethod);
  }
}

export class CodeRx extends Code<'rxjs'> {
  constructor(
    api: ApiRx,
    abi: string | Record<string, unknown> | Abi,
    wasm: Uint8Array | string | Buffer | null | undefined,
  ) {
    super(api, abi, wasm, toRxMethod);
  }
}

export class ContractRx extends Contract<'rxjs'> {
  constructor(
    api: ApiRx,
    abi: string | Record<string, unknown> | Abi,
    address: string | AccountId,
  ) {
    super(api, abi, address, toRxMethod);
  }
}
