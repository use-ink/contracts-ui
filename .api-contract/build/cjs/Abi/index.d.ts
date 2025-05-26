import type {
  ChainProperties,
  ContractMetadataV4,
  ContractMetadataV5,
  ContractProjectInfo,
  EventRecord,
} from '@polkadot/types/interfaces';
import type { Codec, Registry, TypeDef } from '@polkadot/types/types';
import type {
  AbiConstructor,
  AbiEvent,
  AbiMessage,
  DecodedEvent,
  DecodedMessage,
} from '../types.js';
export type ContractMetadataSupported = ContractMetadataV4 | ContractMetadataV5;
export declare class Abi {
  #private;
  readonly events: AbiEvent[];
  readonly constructors: AbiConstructor[];
  readonly info: ContractProjectInfo;
  readonly json: Record<string, unknown>;
  readonly messages: AbiMessage[];
  readonly metadata: ContractMetadataSupported;
  readonly registry: Registry;
  readonly environment: Map<string, TypeDef | Codec>;
  constructor(abiJson: Record<string, unknown> | string, chainProperties?: ChainProperties);
  /**
   * Warning: Unstable API, bound to change
   */
  decodeEvent(record: EventRecord): DecodedEvent;
  /**
   * Warning: Unstable API, bound to change
   */
  decodeConstructor(data: Uint8Array): DecodedMessage;
  /**
   * Warning: Unstable API, bound to change
   */
  decodeMessage(data: Uint8Array): DecodedMessage;
  findConstructor(constructorOrId: AbiConstructor | string | number): AbiConstructor;
  findMessage(messageOrId: AbiMessage | string | number): AbiMessage;
}
