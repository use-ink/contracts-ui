import type {
  ContractMetadataV2,
  ContractMetadataV3,
} from 'https://deno.land/x/polkadot/types/interfaces/index.ts';
import type { Registry } from 'https://deno.land/x/polkadot/types/types/index.ts';

import { objectSpread } from 'https://deno.land/x/polkadot/util/mod.ts';

export function v2ToV3(registry: Registry, v2: ContractMetadataV2): ContractMetadataV3 {
  return registry.createType(
    'ContractMetadataV3',
    objectSpread({}, v2, {
      spec: objectSpread({}, v2.spec, {
        constructors: v2.spec.constructors.map(c =>
          // V3 introduces the payable flag on constructors, for <V3, it is always true
          registry.createType('ContractConstructorSpecV3', objectSpread({}, c, { payable: true })),
        ),
      }),
    }),
  );
}
