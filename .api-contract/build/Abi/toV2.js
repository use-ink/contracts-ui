import { objectSpread } from '@polkadot/util';
const ARG_TYPES = {
  ContractConstructorSpec: 'ContractMessageParamSpecV2',
  ContractEventSpec: 'ContractEventParamSpecV2',
  ContractMessageSpec: 'ContractMessageParamSpecV2',
};
function v1ToV2Label(entry) {
  return objectSpread({}, entry, {
    label: Array.isArray(entry.name) ? entry.name.join('::') : entry.name,
  });
}
function v1ToV2Labels(registry, outType, all) {
  return all.map(e =>
    registry.createType(
      `${outType}V2`,
      objectSpread(v1ToV2Label(e), {
        args: e.args.map(a => registry.createType(ARG_TYPES[outType], v1ToV2Label(a))),
      }),
    ),
  );
}
export function v1ToV2(registry, v1) {
  return registry.createType(
    'ContractMetadataV2',
    objectSpread({}, v1, {
      spec: objectSpread({}, v1.spec, {
        constructors: v1ToV2Labels(registry, 'ContractConstructorSpec', v1.spec.constructors),
        events: v1ToV2Labels(registry, 'ContractEventSpec', v1.spec.events),
        messages: v1ToV2Labels(registry, 'ContractMessageSpec', v1.spec.messages),
      }),
    }),
  );
}
