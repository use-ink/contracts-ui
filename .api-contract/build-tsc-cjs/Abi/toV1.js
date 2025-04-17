'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.v0ToV1 = v0ToV1;
const types_1 = require('@polkadot/types');
const util_1 = require('@polkadot/util');
function v0ToV1Names(all) {
  return all.map(e =>
    (0, util_1.objectSpread)({}, e, {
      name: Array.isArray(e.name) ? e.name : [e.name],
    }),
  );
}
function v0ToV1(registry, v0) {
  if (!v0.metadataVersion.length) {
    throw new Error('Invalid format for V0 (detected) contract metadata');
  }
  return registry.createType(
    'ContractMetadataV1',
    (0, util_1.objectSpread)({}, v0, {
      spec: (0, util_1.objectSpread)({}, v0.spec, {
        constructors: v0ToV1Names(v0.spec.constructors),
        messages: v0ToV1Names(v0.spec.messages),
      }),
      types: (0, types_1.convertSiV0toV1)(registry, v0.types),
    }),
  );
}
