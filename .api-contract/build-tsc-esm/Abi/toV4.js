import { objectSpread } from '@polkadot/util';
export function v3ToV4(registry, v3) {
  return registry.createType(
    'ContractMetadataV4',
    objectSpread({}, v3, {
      spec: objectSpread({}, v3.spec, {
        constructors: v3.spec.constructors.map(c =>
          registry.createType('ContractConstructorSpecV4', objectSpread({}, c)),
        ),
        messages: v3.spec.messages.map(m =>
          registry.createType('ContractMessageSpecV3', objectSpread({}, m)),
        ),
      }),
      version: registry.createType('Text', '4'),
    }),
  );
}
