import type {
  ContractMetadataV4,
  ContractMetadataV5,
  ContractMetadataV6,
} from '@polkadot/types/interfaces';
import type { Registry } from '@polkadot/types/types';
import type { ContractMetadataSupported } from './index.js';
export declare const enumVersions: readonly ['V6', 'V5', 'V4', 'V3', 'V2', 'V1'];
type Versions = (typeof enumVersions)[number] | 'V0';
type Converter = (registry: Registry, vx: any) => ContractMetadataSupported;
export declare function v6ToLatestCompatible(
  _registry: Registry,
  v6: ContractMetadataV6,
): ContractMetadataV6;
export declare function v5ToLatestCompatible(
  _registry: Registry,
  v5: ContractMetadataV5,
): ContractMetadataV5;
export declare function v4ToLatestCompatible(
  _registry: Registry,
  v4: ContractMetadataV4,
): ContractMetadataV4;
export declare const v3ToLatestCompatible: (
  registry: Registry,
  input: import('@polkadot/types/interfaces').ContractMetadataV3,
) => ContractMetadataSupported;
export declare const v2ToLatestCompatible: (
  registry: Registry,
  input: import('@polkadot/types/interfaces').ContractMetadataV2,
) => ContractMetadataSupported;
export declare const v1ToLatestCompatible: (
  registry: Registry,
  input: import('@polkadot/types/interfaces').ContractMetadataV1,
) => ContractMetadataSupported;
export declare const v0ToLatestCompatible: (
  registry: Registry,
  input: import('@polkadot/types/interfaces').ContractMetadataV0,
) => ContractMetadataSupported;
export declare const convertVersions: [Versions, Converter][];
export {};
