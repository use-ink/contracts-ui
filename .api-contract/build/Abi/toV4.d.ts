import type { ContractMetadataV3, ContractMetadataV4 } from '@polkadot/types/interfaces';
import type { Registry } from '@polkadot/types/types';
export declare function v3ToV4(registry: Registry, v3: ContractMetadataV3): ContractMetadataV4;
