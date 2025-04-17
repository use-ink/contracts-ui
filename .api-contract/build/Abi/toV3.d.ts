import type { ContractMetadataV2, ContractMetadataV3 } from '@polkadot/types/interfaces';
import type { Registry } from '@polkadot/types/types';
export declare function v2ToV3(registry: Registry, v2: ContractMetadataV2): ContractMetadataV3;
