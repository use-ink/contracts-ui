import { Option, TypeRegistry } from '@polkadot/types';
import { TypeDefInfo } from '@polkadot/types-create';
import {
  assertReturn,
  compactAddLength,
  compactStripLength,
  isBn,
  isNumber,
  isObject,
  isString,
  isUndefined,
  logger,
  stringCamelCase,
  stringify,
  u8aConcat,
  u8aToHex,
} from '@polkadot/util';
import { convertVersions, enumVersions } from './toLatestCompatible.js';
const l = logger('Abi');
const PRIMITIVE_ALWAYS = ['AccountId', 'AccountIndex', 'Address', 'Balance'];
function findMessage(list, messageOrId) {
  const message = isNumber(messageOrId)
    ? list[messageOrId]
    : isString(messageOrId)
      ? list.find(({ identifier }) =>
          [identifier, stringCamelCase(identifier)].includes(messageOrId.toString()),
        )
      : messageOrId;
  return assertReturn(
    message,
    () => `Attempted to call an invalid contract interface, ${stringify(messageOrId)}`,
  );
}
function getMetadata(registry, json) {
  // this is for V1, V2, V3
  const vx = enumVersions.find(v => isObject(json[v]));
  // this was added in V4
  const jsonVersion = json.version;
  if (!vx && jsonVersion && !enumVersions.find(v => v === `V${jsonVersion}`)) {
    throw new Error(`Unable to handle version ${jsonVersion}`);
  }
  const metadata = registry.createType(
    'ContractMetadata',
    vx ? { [vx]: json[vx] } : jsonVersion ? { [`V${jsonVersion}`]: json } : { V0: json },
  );
  const converter = convertVersions.find(([v]) => metadata[`is${v}`]);
  if (!converter) {
    throw new Error(`Unable to convert ABI with version ${metadata.type} to a supported version`);
  }
  const upgradedMetadata = converter[1](registry, metadata[`as${converter[0]}`]);
  return upgradedMetadata;
}
function parseJson(json, chainProperties) {
  const registry = new TypeRegistry();
  const info = registry.createType('ContractProjectInfo', json);
  const metadata = getMetadata(registry, json);
  const lookup = registry.createType('PortableRegistry', { types: metadata.types }, true);
  // attach the lookup to the registry - now the types are known
  registry.setLookup(lookup);
  if (chainProperties) {
    registry.setChainProperties(chainProperties);
  }
  // warm-up the actual type, pre-use
  lookup.types.forEach(({ id }) => lookup.getTypeDef(id));
  return [json, registry, metadata, info];
}
/**
 * @internal
 * Determines if the given input value is a ContractTypeSpec
 */
function isTypeSpec(value) {
  return (
    !!value && value instanceof Map && !isUndefined(value.type) && !isUndefined(value.displayName)
  );
}
/**
 * @internal
 * Determines if the given input value is an Option
 */
function isOption(value) {
  return !!value && value instanceof Option;
}
export class Abi {
  events;
  constructors;
  info;
  json;
  messages;
  metadata;
  registry;
  environment = new Map();
  constructor(abiJson, chainProperties) {
    [this.json, this.registry, this.metadata, this.info] = parseJson(
      isString(abiJson) ? JSON.parse(abiJson) : abiJson,
      chainProperties,
    );
    this.constructors = this.metadata.spec.constructors.map((spec, index) =>
      this.__internal__createMessage(spec, index, {
        isConstructor: true,
        isDefault: spec.default.isTrue,
        isPayable: spec.payable.isTrue,
        returnType: spec.returnType.isSome
          ? this.registry.lookup.getTypeDef(spec.returnType.unwrap().type)
          : null,
      }),
    );
    this.events = this.metadata.spec.events.map((_, index) => this.__internal__createEvent(index));
    this.messages = this.metadata.spec.messages.map((spec, index) =>
      this.__internal__createMessage(spec, index, {
        isDefault: spec.default.isTrue,
        isMutating: spec.mutates.isTrue,
        isPayable: spec.payable.isTrue,
        returnType: spec.returnType.isSome
          ? this.registry.lookup.getTypeDef(spec.returnType.unwrap().type)
          : null,
      }),
    );
    // NOTE See the rationale for having Option<...> values in the actual
    // ContractEnvironmentV4 structure definition in interfaces/contractsAbi
    // (Due to conversions, the fields may not exist)
    for (const [key, opt] of this.metadata.spec.environment.entries()) {
      if (isOption(opt)) {
        if (opt.isSome) {
          const value = opt.unwrap();
          if (isBn(value)) {
            this.environment.set(key, value);
          } else if (isTypeSpec(value)) {
            this.environment.set(key, this.registry.lookup.getTypeDef(value.type));
          } else {
            throw new Error(
              `Invalid environment definition for ${key}:: Expected either Number or ContractTypeSpec`,
            );
          }
        }
      } else {
        throw new Error(`Expected Option<*> definition for ${key} in ContractEnvironment`);
      }
    }
  }
  /**
   * Warning: Unstable API, bound to change
   */
  decodeEvent(record) {
    switch (this.metadata.version.toString()) {
      // earlier version are hoisted to v4
      case '4':
        return this.__internal__decodeEventV4(record);
      // Latest
      default:
        return this.__internal__decodeEventV5(record);
    }
  }
  __internal__decodeEventV5 = record => {
    // Find event by first topic, which potentially is the signature_topic
    const signatureTopic = record.topics[0];
    const data = record.event.data[1];
    if (signatureTopic) {
      const event = this.events.find(
        e =>
          e.signatureTopic !== undefined &&
          e.signatureTopic !== null &&
          e.signatureTopic === signatureTopic.toHex(),
      );
      // Early return if event found by signature topic
      if (event) {
        return event.fromU8a(data);
      }
    }
    // If no event returned yet, it might be anonymous
    const amountOfTopics = record.topics.length;
    const potentialEvents = this.events.filter(e => {
      // event can't have a signature topic
      if (e.signatureTopic !== null && e.signatureTopic !== undefined) {
        return false;
      }
      // event should have same amount of indexed fields as emitted topics
      const amountIndexed = e.args.filter(a => a.indexed).length;
      if (amountIndexed !== amountOfTopics) {
        return false;
      }
      // If all conditions met, it's a potential event
      return true;
    });
    if (potentialEvents.length === 1) {
      return potentialEvents[0].fromU8a(data);
    }
    throw new Error('Unable to determine event');
  };
  __internal__decodeEventV4 = record => {
    const data = record.event.data[1];
    const index = data[0];
    const event = this.events[index];
    if (!event) {
      throw new Error(`Unable to find event with index ${index}`);
    }
    return event.fromU8a(data.subarray(1));
  };
  /**
   * Warning: Unstable API, bound to change
   */
  decodeConstructor(data) {
    return this.__internal__decodeMessage('message', this.constructors, data);
  }
  /**
   * Warning: Unstable API, bound to change
   */
  decodeMessage(data) {
    return this.__internal__decodeMessage('message', this.messages, data);
  }
  findConstructor(constructorOrId) {
    return findMessage(this.constructors, constructorOrId);
  }
  findMessage(messageOrId) {
    return findMessage(this.messages, messageOrId);
  }
  __internal__createArgs = (args, spec) => {
    return args.map(({ label, type }, index) => {
      try {
        if (!isObject(type)) {
          throw new Error('Invalid type definition found');
        }
        const displayName = type.displayName.length
          ? type.displayName[type.displayName.length - 1].toString()
          : undefined;
        const camelName = stringCamelCase(label);
        if (displayName && PRIMITIVE_ALWAYS.includes(displayName)) {
          return {
            name: camelName,
            type: {
              info: TypeDefInfo.Plain,
              type: displayName,
            },
          };
        }
        const typeDef = this.registry.lookup.getTypeDef(type.type);
        return {
          name: camelName,
          type:
            displayName && !typeDef.type.startsWith(displayName)
              ? { displayName, ...typeDef }
              : typeDef,
        };
      } catch (error) {
        l.error(`Error expanding argument ${index} in ${stringify(spec)}`);
        throw error;
      }
    });
  };
  __internal__createMessageParams = (args, spec) => {
    return this.__internal__createArgs(args, spec);
  };
  __internal__createEventParams = (args, spec) => {
    const params = this.__internal__createArgs(args, spec);
    return params.map((p, index) => ({ ...p, indexed: args[index].indexed.toPrimitive() }));
  };
  __internal__createEvent = index => {
    // TODO TypeScript would narrow this type to the correct version,
    // but version is `Text` so I need to call `toString()` here,
    // which breaks the type inference.
    switch (this.metadata.version.toString()) {
      case '4':
        return this.__internal__createEventV4(this.metadata.spec.events[index], index);
      default:
        return this.__internal__createEventV5(this.metadata.spec.events[index], index);
    }
  };
  __internal__createEventV5 = (spec, index) => {
    const args = this.__internal__createEventParams(spec.args, spec);
    const event = {
      args,
      docs: spec.docs.map(d => d.toString()),
      fromU8a: data => ({
        args: this.__internal__decodeArgs(args, data),
        event,
      }),
      identifier: [spec.module_path, spec.label].join('::'),
      index,
      signatureTopic: spec.signature_topic.isSome ? spec.signature_topic.unwrap().toHex() : null,
    };
    return event;
  };
  __internal__createEventV4 = (spec, index) => {
    const args = this.__internal__createEventParams(spec.args, spec);
    const event = {
      args,
      docs: spec.docs.map(d => d.toString()),
      fromU8a: data => ({
        args: this.__internal__decodeArgs(args, data),
        event,
      }),
      identifier: spec.label.toString(),
      index,
    };
    return event;
  };
  __internal__createMessage = (spec, index, add = {}) => {
    const args = this.__internal__createMessageParams(spec.args, spec);
    const identifier = spec.label.toString();
    const message = {
      ...add,
      args,
      docs: spec.docs.map(d => d.toString()),
      fromU8a: data => ({
        args: this.__internal__decodeArgs(args, data),
        message,
      }),
      identifier,
      index,
      isDefault: spec.default.isTrue,
      method: stringCamelCase(identifier),
      path: identifier.split('::').map(s => stringCamelCase(s)),
      selector: spec.selector,
      toU8a: params => this.__internal__encodeMessageArgs(spec, args, params),
    };
    return message;
  };
  __internal__decodeArgs = (args, data) => {
    // for decoding we expect the input to be just the arg data, no selectors
    // no length added (this allows use with events as well)
    let offset = 0;
    return args.map(({ type: { lookupName, type } }) => {
      const value = this.registry.createType(lookupName || type, data.subarray(offset));
      offset += value.encodedLength;
      return value;
    });
  };
  __internal__decodeMessage = (type, list, data) => {
    const [, trimmed] = compactStripLength(data);
    const selector = trimmed.subarray(0, 4);
    const message = list.find(m => m.selector.eq(selector));
    if (!message) {
      throw new Error(`Unable to find ${type} with selector ${u8aToHex(selector)}`);
    }
    return message.fromU8a(trimmed.subarray(4));
  };
  __internal__encodeMessageArgs = ({ label, selector }, args, data) => {
    if (data.length !== args.length) {
      throw new Error(
        `Expected ${args.length} arguments to contract message '${label.toString()}', found ${data.length}`,
      );
    }
    return compactAddLength(
      u8aConcat(
        this.registry.createType('ContractSelector', selector).toU8a(),
        ...args.map(({ type: { lookupName, type } }, index) =>
          this.registry.createType(lookupName || type, data[index]).toU8a(),
        ),
      ),
    );
  };
}
