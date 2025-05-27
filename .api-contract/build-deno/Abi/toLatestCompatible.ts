import type {
  ContractMetadataV4,
  ContractMetadataV5,
  ContractMetadataV6,
} from 'https://deno.land/x/polkadot/types/interfaces/index.ts';
import type { Registry } from 'https://deno.land/x/polkadot/types/types/index.ts';
import type { ContractMetadataSupported } from './index.ts';

import { v0ToV1 } from './toV1.ts';
import { v1ToV2 } from './toV2.ts';
import { v2ToV3 } from './toV3.ts';
import { v3ToV4 } from './toV4.ts';

export const enumVersions = ['V6', 'V5', 'V4', 'V3', 'V2', 'V1'] as const;

type Versions = (typeof enumVersions)[number] | 'V0';

type Converter = (registry: Registry, vx: any) => ContractMetadataSupported;

function createConverter<I, O>(
  next: (registry: Registry, input: O) => ContractMetadataSupported,
  step: (registry: Registry, input: I) => O,
): (registry: Registry, input: I) => ContractMetadataSupported {
  return (registry: Registry, input: I): ContractMetadataSupported =>
    next(registry, step(registry, input));
}

export function v6ToLatestCompatible(
  _registry: Registry,
  v6: ContractMetadataV6,
): ContractMetadataV6 {
  return v6;
}

export function v5ToLatestCompatible(
  _registry: Registry,
  v5: ContractMetadataV5,
): ContractMetadataV5 {
  return v5;
}

export function v4ToLatestCompatible(
  _registry: Registry,
  v4: ContractMetadataV4,
): ContractMetadataV4 {
  return v4;
}

export const v3ToLatestCompatible = /*#__PURE__*/ createConverter(v4ToLatestCompatible, v3ToV4);
export const v2ToLatestCompatible = /*#__PURE__*/ createConverter(v3ToLatestCompatible, v2ToV3);
export const v1ToLatestCompatible = /*#__PURE__*/ createConverter(v2ToLatestCompatible, v1ToV2);
export const v0ToLatestCompatible = /*#__PURE__*/ createConverter(v1ToLatestCompatible, v0ToV1);

export const convertVersions: [Versions, Converter][] = [
  ['V6', v6ToLatestCompatible],
  ['V5', v5ToLatestCompatible],
  ['V4', v4ToLatestCompatible],
  ['V3', v3ToLatestCompatible],
  ['V2', v2ToLatestCompatible],
  ['V1', v1ToLatestCompatible],
  ['V0', v0ToLatestCompatible],
];
