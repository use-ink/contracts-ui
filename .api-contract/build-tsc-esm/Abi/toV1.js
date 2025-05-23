import { convertSiV0toV1 } from '@polkadot/types';
import { objectSpread } from '@polkadot/util';
function v0ToV1Names(all) {
  return all.map(e =>
    objectSpread({}, e, {
      name: Array.isArray(e.name) ? e.name : [e.name],
    }),
  );
}
export function v0ToV1(registry, v0) {
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
