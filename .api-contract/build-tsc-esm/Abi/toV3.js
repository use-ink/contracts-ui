import { objectSpread } from '@polkadot/util';
export function v2ToV3(registry, v2) {
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
