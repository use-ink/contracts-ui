import type { ApiBase } from 'https://deno.land/x/polkadot/api/base/index.ts';
import type { ApiTypes, DecorateMethod } from 'https://deno.land/x/polkadot/api/types/index.ts';
import type { WeightV2 } from 'https://deno.land/x/polkadot/types/interfaces/index.ts';
import type { Registry } from 'https://deno.land/x/polkadot/types/types/index.ts';

import { isFunction } from 'https://deno.land/x/polkadot/util/mod.ts';

import { Abi } from '../Abi/index.ts';

export abstract class Base<ApiType extends ApiTypes> {
  readonly abi: Abi;
  readonly api: ApiBase<ApiType>;

  protected readonly _decorateMethod: DecorateMethod<ApiType>;
  protected readonly _isWeightV1: boolean;

  constructor(
    api: ApiBase<ApiType>,
    abi: string | Record<string, unknown> | Abi,
    decorateMethod: DecorateMethod<ApiType>,
  ) {
    if (!api || !api.isConnected || !api.tx) {
      throw new Error(
        'Your API has not been initialized correctly and is not connected to a chain',
      );
    } else if (
      !api.tx.contracts ||
      !isFunction(api.tx.contracts.instantiateWithCode) ||
      api.tx.contracts.instantiateWithCode.meta.args.length !== 6
    ) {
      throw new Error(
        'The runtime does not expose api.tx.contracts.instantiateWithCode with storageDepositLimit',
      );
    } else if (!api.call.contractsApi || !isFunction(api.call.contractsApi.call)) {
      throw new Error(
        'Your runtime does not expose the api.call.contractsApi.call runtime interfaces',
      );
    }

    this.abi = abi instanceof Abi ? abi : new Abi(abi, api.registry.getChainProperties());
    this.api = api;
    this._decorateMethod = decorateMethod;
    this._isWeightV1 = !api.registry.createType<WeightV2>('Weight').proofSize;
  }

  public get registry(): Registry {
    return this.api.registry;
  }
}
