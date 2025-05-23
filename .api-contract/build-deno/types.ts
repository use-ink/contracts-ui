import type { ApiBase } from 'https://deno.land/x/polkadot/api/base/index.ts';
import type { ApiTypes } from 'https://deno.land/x/polkadot/api/types/index.ts';
import type { Text } from 'https://deno.land/x/polkadot/types/mod.ts';
import type {
  ContractExecResultResult,
  ContractSelector,
  StorageDeposit,
  Weight,
  WeightV2,
} from 'https://deno.land/x/polkadot/types/interfaces/index.ts';
import type { Codec, TypeDef } from 'https://deno.land/x/polkadot/types/types/index.ts';
import type { BN } from 'https://deno.land/x/polkadot/util/mod.ts';
import type { HexString } from 'https://deno.land/x/polkadot/util/types.ts';
import type { Abi } from './index.ts';

export interface ContractBase<ApiType extends ApiTypes> {
  readonly abi: Abi;
  readonly api: ApiBase<ApiType>;

  getMessage: (name: string) => AbiMessage;
  messages: AbiMessage[];
}

export interface AbiParam {
  name: string;
  type: TypeDef;
}

export type AbiMessageParam = AbiParam;

export interface AbiEventParam extends AbiParam {
  indexed: boolean;
}

export interface AbiEvent {
  args: AbiEventParam[];
  docs: string[];
  fromU8a: (data: Uint8Array) => DecodedEvent;
  identifier: string;
  index: number;
  signatureTopic?: HexString | null;
}

export interface AbiMessage {
  args: AbiMessageParam[];
  docs: string[];
  fromU8a: (data: Uint8Array) => DecodedMessage;
  identifier: string;
  index: number;
  isConstructor?: boolean;
  isDefault?: boolean;
  isMutating?: boolean;
  isPayable?: boolean;
  method: string;
  path: string[];
  returnType?: TypeDef | null;
  selector: ContractSelector;
  toU8a: (params: unknown[]) => Uint8Array;
}

export type AbiConstructor = AbiMessage;

export type InterfaceContractCalls = Record<string, Function>;

export interface ContractCallOutcome {
  debugMessage: Text;
  gasConsumed: Weight;
  gasRequired: Weight;
  output: Codec | null;
  result: ContractExecResultResult;
  storageDeposit: StorageDeposit;
}

export interface DecodedEvent {
  args: Codec[];
  event: AbiEvent;
}

export interface DecodedMessage {
  args: Codec[];
  message: AbiMessage;
}

export interface ContractOptions {
  gasLimit?: bigint | string | number | BN | WeightV2;
  storageDepositLimit?: bigint | string | number | BN | null;
  value?: bigint | BN | string | number;
}

export interface BlueprintOptions extends ContractOptions {
  salt?: Uint8Array | string | null;
}

export interface WeightAll {
  v1Weight: BN;
  v2Weight: {
    refTime: BN;
    proofSize?: BN | undefined;
  };
}
