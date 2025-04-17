'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.v2ToV3 = v2ToV3;
const util_1 = require('@polkadot/util');
function v2ToV3(registry, v2) {
  return registry.createType(
    'ContractMetadataV3',
    (0, util_1.objectSpread)({}, v2, {
      spec: (0, util_1.objectSpread)({}, v2.spec, {
        constructors: v2.spec.constructors.map(c =>
          // V3 introduces the payable flag on constructors, for <V3, it is always true
          registry.createType(
            'ContractConstructorSpecV3',
            (0, util_1.objectSpread)({}, c, { payable: true }),
          ),
        ),
      }),
    }),
  );
}
