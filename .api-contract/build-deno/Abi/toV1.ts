import type {
  ContractMetadataV0,
  ContractMetadataV1,
} from 'https://deno.land/x/polkadot/types/interfaces/index.ts';
import type { Registry } from 'https://deno.land/x/polkadot/types/types/index.ts';

import { convertSiV0toV1 } from 'https://deno.land/x/polkadot/types/mod.ts';
import { objectSpread } from 'https://deno.land/x/polkadot/util/mod.ts';

interface Named {
  name: unknown;
}

function v0ToV1Names(all: Named[]): unknown[] {
  return all.map(e =>
    objectSpread({}, e, {
      name: Array.isArray(e.name) ? e.name : [e.name],
    }),
  );
}

export function v0ToV1(registry: Registry, v0: ContractMetadataV0): ContractMetadataV1 {
  if (!v0.metadataVersion.length) {
    throw new Error('Invalid format for V0 (detected) contract metadata');
  }

  return registry.createType(
    'ContractMetadataV1',
    objectSpread({}, v0, {
      spec: objectSpread({}, v0.spec, {
        constructors: v0ToV1Names(v0.spec.constructors),
        messages: v0ToV1Names(v0.spec.messages),
      }),
      types: convertSiV0toV1(registry, v0.types),
    }),
  );
}
