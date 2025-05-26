import type { ContractMetadataV0, ContractMetadataV1 } from '@polkadot/types/interfaces';
import type { Registry } from '@polkadot/types/types';
export declare function v0ToV1(registry: Registry, v0: ContractMetadataV0): ContractMetadataV1;
