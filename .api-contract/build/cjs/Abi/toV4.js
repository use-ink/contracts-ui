'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.v3ToV4 = v3ToV4;
const util_1 = require('@polkadot/util');
function v3ToV4(registry, v3) {
  return registry.createType(
    'ContractMetadataV4',
    (0, util_1.objectSpread)({}, v3, {
      spec: (0, util_1.objectSpread)({}, v3.spec, {
        constructors: v3.spec.constructors.map(c =>
          registry.createType('ContractConstructorSpecV4', (0, util_1.objectSpread)({}, c)),
        ),
        messages: v3.spec.messages.map(m =>
          registry.createType('ContractMessageSpecV3', (0, util_1.objectSpread)({}, m)),
        ),
      }),
      version: registry.createType('Text', '4'),
    }),
  );
}
