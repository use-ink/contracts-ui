import type { ContractMetadataV1, ContractMetadataV2 } from '@polkadot/types/interfaces';
import type { Registry } from '@polkadot/types/types';
export declare function v1ToV2(registry: Registry, v1: ContractMetadataV1): ContractMetadataV2;
