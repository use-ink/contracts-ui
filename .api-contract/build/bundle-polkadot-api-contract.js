(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(
        exports,
        require('@polkadot/types'),
        require('@polkadot/util'),
        require('@polkadot/api'),
        require('@polkadot/util-crypto'),
      )
    : typeof define === 'function' && define.amd
      ? define(
          [
            'exports',
            '@polkadot/types',
            '@polkadot/util',
            '@polkadot/api',
            '@polkadot/util-crypto',
          ],
          factory,
        )
      : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
        factory(
          (global.polkadotApiContract = {}),
          global.polkadotTypes,
          global.polkadotUtil,
          global.polkadotApi,
          global.polkadotUtilCrypto,
        ));
})(this, function (exports, types, util, api, utilCrypto) {
  'use strict';

  const global =
    typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : window;

  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  var TypeDefInfo;
  (function (TypeDefInfo) {
    TypeDefInfo[(TypeDefInfo['BTreeMap'] = 0)] = 'BTreeMap';
    TypeDefInfo[(TypeDefInfo['BTreeSet'] = 1)] = 'BTreeSet';
    TypeDefInfo[(TypeDefInfo['Compact'] = 2)] = 'Compact';
    TypeDefInfo[(TypeDefInfo['DoNotConstruct'] = 3)] = 'DoNotConstruct';
    TypeDefInfo[(TypeDefInfo['Enum'] = 4)] = 'Enum';
    TypeDefInfo[(TypeDefInfo['HashMap'] = 5)] = 'HashMap';
    TypeDefInfo[(TypeDefInfo['Int'] = 6)] = 'Int';
    TypeDefInfo[(TypeDefInfo['Linkage'] = 7)] = 'Linkage';
    TypeDefInfo[(TypeDefInfo['Null'] = 8)] = 'Null';
    TypeDefInfo[(TypeDefInfo['Option'] = 9)] = 'Option';
    TypeDefInfo[(TypeDefInfo['Plain'] = 10)] = 'Plain';
    TypeDefInfo[(TypeDefInfo['Range'] = 11)] = 'Range';
    TypeDefInfo[(TypeDefInfo['RangeInclusive'] = 12)] = 'RangeInclusive';
    TypeDefInfo[(TypeDefInfo['Result'] = 13)] = 'Result';
    TypeDefInfo[(TypeDefInfo['Set'] = 14)] = 'Set';
    TypeDefInfo[(TypeDefInfo['Si'] = 15)] = 'Si';
    TypeDefInfo[(TypeDefInfo['Struct'] = 16)] = 'Struct';
    TypeDefInfo[(TypeDefInfo['Tuple'] = 17)] = 'Tuple';
    TypeDefInfo[(TypeDefInfo['UInt'] = 18)] = 'UInt';
    TypeDefInfo[(TypeDefInfo['Vec'] = 19)] = 'Vec';
    TypeDefInfo[(TypeDefInfo['VecFixed'] = 20)] = 'VecFixed';
    TypeDefInfo[(TypeDefInfo['WrapperKeepOpaque'] = 21)] = 'WrapperKeepOpaque';
    TypeDefInfo[(TypeDefInfo['WrapperOpaque'] = 22)] = 'WrapperOpaque';
  })(TypeDefInfo || (TypeDefInfo = {}));

  function v0ToV1Names(all) {
    return all.map(e =>
      util.objectSpread({}, e, {
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
      util.objectSpread({}, v0, {
        spec: util.objectSpread({}, v0.spec, {
          constructors: v0ToV1Names(v0.spec.constructors),
          messages: v0ToV1Names(v0.spec.messages),
        }),
        types: types.convertSiV0toV1(registry, v0.types),
      }),
    );
  }

  const ARG_TYPES = {
    ContractConstructorSpec: 'ContractMessageParamSpecV2',
    ContractEventSpec: 'ContractEventParamSpecV2',
    ContractMessageSpec: 'ContractMessageParamSpecV2',
  };
  function v1ToV2Label(entry) {
    return util.objectSpread({}, entry, {
      label: Array.isArray(entry.name) ? entry.name.join('::') : entry.name,
    });
  }
  function v1ToV2Labels(registry, outType, all) {
    return all.map(e =>
      registry.createType(
        `${outType}V2`,
        util.objectSpread(v1ToV2Label(e), {
          args: e.args.map(a => registry.createType(ARG_TYPES[outType], v1ToV2Label(a))),
        }),
      ),
    );
  }
  function v1ToV2(registry, v1) {
    return registry.createType(
      'ContractMetadataV2',
      util.objectSpread({}, v1, {
        spec: util.objectSpread({}, v1.spec, {
          constructors: v1ToV2Labels(registry, 'ContractConstructorSpec', v1.spec.constructors),
          events: v1ToV2Labels(registry, 'ContractEventSpec', v1.spec.events),
          messages: v1ToV2Labels(registry, 'ContractMessageSpec', v1.spec.messages),
        }),
      }),
    );
  }

  function v2ToV3(registry, v2) {
    return registry.createType(
      'ContractMetadataV3',
      util.objectSpread({}, v2, {
        spec: util.objectSpread({}, v2.spec, {
          constructors: v2.spec.constructors.map(c =>
            registry.createType(
              'ContractConstructorSpecV3',
              util.objectSpread({}, c, { payable: true }),
            ),
          ),
        }),
      }),
    );
  }

  function v3ToV4(registry, v3) {
    return registry.createType(
      'ContractMetadataV4',
      util.objectSpread({}, v3, {
        spec: util.objectSpread({}, v3.spec, {
          constructors: v3.spec.constructors.map(c =>
            registry.createType('ContractConstructorSpecV4', util.objectSpread({}, c)),
          ),
          messages: v3.spec.messages.map(m =>
            registry.createType('ContractMessageSpecV3', util.objectSpread({}, m)),
          ),
        }),
        version: registry.createType('Text', '4'),
      }),
    );
  }

  const enumVersions = ['V5', 'V4', 'V3', 'V2', 'V1'];
  function createConverter(next, step) {
    return (registry, input) => next(registry, step(registry, input));
  }
  function v5ToLatestCompatible(_registry, v5) {
    return v5;
  }
  function v4ToLatestCompatible(_registry, v4) {
    return v4;
  }
  const v3ToLatestCompatible = createConverter(v4ToLatestCompatible, v3ToV4);
  const v2ToLatestCompatible = createConverter(v3ToLatestCompatible, v2ToV3);
  const v1ToLatestCompatible = createConverter(v2ToLatestCompatible, v1ToV2);
  const v0ToLatestCompatible = createConverter(v1ToLatestCompatible, v0ToV1);
  const convertVersions = [
    ['V5', v5ToLatestCompatible],
    ['V4', v4ToLatestCompatible],
    ['V3', v3ToLatestCompatible],
    ['V2', v2ToLatestCompatible],
    ['V1', v1ToLatestCompatible],
    ['V0', v0ToLatestCompatible],
  ];

  const l$1 = util.logger('Abi');
  const PRIMITIVE_ALWAYS = ['AccountId', 'AccountIndex', 'Address', 'Balance'];
  function findMessage(list, messageOrId) {
    const message = util.isNumber(messageOrId)
      ? list[messageOrId]
      : util.isString(messageOrId)
        ? list.find(({ identifier }) =>
            [identifier, util.stringCamelCase(identifier)].includes(messageOrId.toString()),
          )
        : messageOrId;
    return util.assertReturn(
      message,
      () => `Attempted to call an invalid contract interface, ${util.stringify(messageOrId)}`,
    );
  }
  function getMetadata(registry, json) {
    const vx = enumVersions.find(v => util.isObject(json[v]));
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
    const registry = new types.TypeRegistry();
    const info = registry.createType('ContractProjectInfo', json);
    const metadata = getMetadata(registry, json);
    const lookup = registry.createType('PortableRegistry', { types: metadata.types }, true);
    registry.setLookup(lookup);
    if (chainProperties) {
      registry.setChainProperties(chainProperties);
    }
    lookup.types.forEach(({ id }) => lookup.getTypeDef(id));
    return [json, registry, metadata, info];
  }
  function isTypeSpec(value) {
    return (
      !!value &&
      value instanceof Map &&
      !util.isUndefined(value.type) &&
      !util.isUndefined(value.displayName)
    );
  }
  function isOption(value) {
    return !!value && value instanceof types.Option;
  }
  class Abi {
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
        util.isString(abiJson) ? JSON.parse(abiJson) : abiJson,
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
      this.events = this.metadata.spec.events.map((_, index) =>
        this.__internal__createEvent(index),
      );
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
      for (const [key, opt] of this.metadata.spec.environment.entries()) {
        if (isOption(opt)) {
          if (opt.isSome) {
            const value = opt.unwrap();
            if (util.isBn(value)) {
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
    decodeEvent(record) {
      switch (this.metadata.version.toString()) {
        case '4':
          return this.__internal__decodeEventV4(record);
        default:
          return this.__internal__decodeEventV5(record);
      }
    }
    __internal__decodeEventV5 = record => {
      const signatureTopic = record.topics[0];
      const data = record.event.data[1];
      if (signatureTopic) {
        const event = this.events.find(
          e =>
            e.signatureTopic !== undefined &&
            e.signatureTopic !== null &&
            e.signatureTopic === signatureTopic.toHex(),
        );
        if (event) {
          return event.fromU8a(data);
        }
      }
      const amountOfTopics = record.topics.length;
      const potentialEvents = this.events.filter(e => {
        if (e.signatureTopic !== null && e.signatureTopic !== undefined) {
          return false;
        }
        const amountIndexed = e.args.filter(a => a.indexed).length;
        if (amountIndexed !== amountOfTopics) {
          return false;
        }
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
    decodeConstructor(data) {
      return this.__internal__decodeMessage('message', this.constructors, data);
    }
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
          if (!util.isObject(type)) {
            throw new Error('Invalid type definition found');
          }
          const displayName = type.displayName.length
            ? type.displayName[type.displayName.length - 1].toString()
            : undefined;
          const camelName = util.stringCamelCase(label);
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
          l$1.error(`Error expanding argument ${index} in ${util.stringify(spec)}`);
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
        method: util.stringCamelCase(identifier),
        path: identifier.split('::').map(s => util.stringCamelCase(s)),
        selector: spec.selector,
        toU8a: params => this.__internal__encodeMessageArgs(spec, args, params),
      };
      return message;
    };
    __internal__decodeArgs = (args, data) => {
      let offset = 0;
      return args.map(({ type: { lookupName, type } }) => {
        const value = this.registry.createType(lookupName || type, data.subarray(offset));
        offset += value.encodedLength;
        return value;
      });
    };
    __internal__decodeMessage = (type, list, data) => {
      const [, trimmed] = util.compactStripLength(data);
      const selector = trimmed.subarray(0, 4);
      const message = list.find(m => m.selector.eq(selector));
      if (!message) {
        throw new Error(`Unable to find ${type} with selector ${util.u8aToHex(selector)}`);
      }
      return message.fromU8a(trimmed.subarray(4));
    };
    __internal__encodeMessageArgs = ({ label, selector }, args, data) => {
      if (data.length !== args.length) {
        throw new Error(
          `Expected ${args.length} arguments to contract message '${label.toString()}', found ${data.length}`,
        );
      }
      return util.compactAddLength(
        util.u8aConcat(
          this.registry.createType('ContractSelector', selector).toU8a(),
          ...args.map(({ type: { lookupName, type } }, index) =>
            this.registry.createType(lookupName || type, data[index]).toU8a(),
          ),
        ),
      );
    };
  }

  const packageInfo = {
    name: '@polkadot/api-contract',
    path:
      {
        url:
          typeof document === 'undefined' && typeof location === 'undefined'
            ? require('u' + 'rl').pathToFileURL(__filename).href
            : typeof document === 'undefined'
              ? location.href
              : (_documentCurrentScript && _documentCurrentScript.src) ||
                new URL('bundle-polkadot-api-contract.js', document.baseURI).href,
      } &&
      (typeof document === 'undefined' && typeof location === 'undefined'
        ? require('u' + 'rl').pathToFileURL(__filename).href
        : typeof document === 'undefined'
          ? location.href
          : (_documentCurrentScript && _documentCurrentScript.src) ||
            new URL('bundle-polkadot-api-contract.js', document.baseURI).href)
        ? new URL(
            typeof document === 'undefined' && typeof location === 'undefined'
              ? require('u' + 'rl').pathToFileURL(__filename).href
              : typeof document === 'undefined'
                ? location.href
                : (_documentCurrentScript && _documentCurrentScript.src) ||
                  new URL('bundle-polkadot-api-contract.js', document.baseURI).href,
          ).pathname.substring(
            0,
            new URL(
              typeof document === 'undefined' && typeof location === 'undefined'
                ? require('u' + 'rl').pathToFileURL(__filename).href
                : typeof document === 'undefined'
                  ? location.href
                  : (_documentCurrentScript && _documentCurrentScript.src) ||
                    new URL('bundle-polkadot-api-contract.js', document.baseURI).href,
            ).pathname.lastIndexOf('/') + 1,
          )
        : 'auto',
    type: 'esm',
    version: '15.8.1',
  };

  class Base {
    abi;
    api;
    _decorateMethod;
    _isWeightV1;
    constructor(api, abi, decorateMethod) {
      if (!api || !api.isConnected || !api.tx) {
        throw new Error(
          'Your API has not been initialized correctly and is not connected to a chain',
        );
      } else if (
        !api.tx.revive ||
        !util.isFunction(api.tx.revive.instantiateWithCode) ||
        api.tx.revive.instantiateWithCode.meta.args.length !== 6
      ) {
        throw new Error(
          'The runtime does not expose api.tx.revive.instantiateWithCode with storageDepositLimit',
        );
      } else if (!api.call.reviveApi || !util.isFunction(api.call.reviveApi.call)) {
        throw new Error(
          'Your runtime does not expose the api.call.reviveApi.call runtime interfaces',
        );
      }
      this.abi = abi instanceof Abi ? abi : new Abi(abi, api.registry.getChainProperties());
      this.api = api;
      this._decorateMethod = decorateMethod;
      this._isWeightV1 = !api.registry.createType('Weight').proofSize;
    }
    get registry() {
      return this.api.registry;
    }
  }

  var extendStatics = function (d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== 'function' && b !== null)
      throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null');
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }
  function __values(o) {
    var s = typeof Symbol === 'function' && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === 'number')
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    throw new TypeError(s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
  }
  function __read(o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  typeof SuppressedError === 'function'
    ? SuppressedError
    : function (error, suppressed, message) {
        var e = new Error(message);
        return (e.name = 'SuppressedError'), (e.error = error), (e.suppressed = suppressed), e;
      };

  function isFunction(value) {
    return typeof value === 'function';
  }

  function createErrorClass(createImpl) {
    var _super = function (instance) {
      Error.call(instance);
      instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
  }

  var UnsubscriptionError = createErrorClass(function (_super) {
    return function UnsubscriptionErrorImpl(errors) {
      _super(this);
      this.message = errors
        ? errors.length +
          ' errors occurred during unsubscription:\n' +
          errors
            .map(function (err, i) {
              return i + 1 + ') ' + err.toString();
            })
            .join('\n  ')
        : '';
      this.name = 'UnsubscriptionError';
      this.errors = errors;
    };
  });

  function arrRemove(arr, item) {
    if (arr) {
      var index = arr.indexOf(item);
      0 <= index && arr.splice(index, 1);
    }
  }

  var Subscription = (function () {
    function Subscription(initialTeardown) {
      this.initialTeardown = initialTeardown;
      this.closed = false;
      this._parentage = null;
      this._finalizers = null;
    }
    Subscription.prototype.unsubscribe = function () {
      var e_1, _a, e_2, _b;
      var errors;
      if (!this.closed) {
        this.closed = true;
        var _parentage = this._parentage;
        if (_parentage) {
          this._parentage = null;
          if (Array.isArray(_parentage)) {
            try {
              for (
                var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next();
                !_parentage_1_1.done;
                _parentage_1_1 = _parentage_1.next()
              ) {
                var parent_1 = _parentage_1_1.value;
                parent_1.remove(this);
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return))
                  _a.call(_parentage_1);
              } finally {
                if (e_1) throw e_1.error;
              }
            }
          } else {
            _parentage.remove(this);
          }
        }
        var initialFinalizer = this.initialTeardown;
        if (isFunction(initialFinalizer)) {
          try {
            initialFinalizer();
          } catch (e) {
            errors = e instanceof UnsubscriptionError ? e.errors : [e];
          }
        }
        var _finalizers = this._finalizers;
        if (_finalizers) {
          this._finalizers = null;
          try {
            for (
              var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next();
              !_finalizers_1_1.done;
              _finalizers_1_1 = _finalizers_1.next()
            ) {
              var finalizer = _finalizers_1_1.value;
              try {
                execFinalizer(finalizer);
              } catch (err) {
                errors = errors !== null && errors !== void 0 ? errors : [];
                if (err instanceof UnsubscriptionError) {
                  errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                } else {
                  errors.push(err);
                }
              }
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return))
                _b.call(_finalizers_1);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
        if (errors) {
          throw new UnsubscriptionError(errors);
        }
      }
    };
    Subscription.prototype.add = function (teardown) {
      var _a;
      if (teardown && teardown !== this) {
        if (this.closed) {
          execFinalizer(teardown);
        } else {
          if (teardown instanceof Subscription) {
            if (teardown.closed || teardown._hasParent(this)) {
              return;
            }
            teardown._addParent(this);
          }
          (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(
            teardown,
          );
        }
      }
    };
    Subscription.prototype._hasParent = function (parent) {
      var _parentage = this._parentage;
      return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    };
    Subscription.prototype._addParent = function (parent) {
      var _parentage = this._parentage;
      this._parentage = Array.isArray(_parentage)
        ? (_parentage.push(parent), _parentage)
        : _parentage
          ? [_parentage, parent]
          : parent;
    };
    Subscription.prototype._removeParent = function (parent) {
      var _parentage = this._parentage;
      if (_parentage === parent) {
        this._parentage = null;
      } else if (Array.isArray(_parentage)) {
        arrRemove(_parentage, parent);
      }
    };
    Subscription.prototype.remove = function (teardown) {
      var _finalizers = this._finalizers;
      _finalizers && arrRemove(_finalizers, teardown);
      if (teardown instanceof Subscription) {
        teardown._removeParent(this);
      }
    };
    Subscription.EMPTY = (function () {
      var empty = new Subscription();
      empty.closed = true;
      return empty;
    })();
    return Subscription;
  })();
  Subscription.EMPTY;
  function isSubscription(value) {
    return (
      value instanceof Subscription ||
      (value &&
        'closed' in value &&
        isFunction(value.remove) &&
        isFunction(value.add) &&
        isFunction(value.unsubscribe))
    );
  }
  function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
      finalizer();
    } else {
      finalizer.unsubscribe();
    }
  }

  var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: undefined,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false,
  };

  var timeoutProvider = {
    setTimeout: function (handler, timeout) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function (handle) {
      var delegate = timeoutProvider.delegate;
      return (
        (delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout
      )(handle);
    },
    delegate: undefined,
  };

  function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function () {
      {
        throw err;
      }
    });
  }

  function noop() {}

  var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destination) {
      var _this = _super.call(this) || this;
      _this.isStopped = false;
      if (destination) {
        _this.destination = destination;
        if (isSubscription(destination)) {
          destination.add(_this);
        }
      } else {
        _this.destination = EMPTY_OBSERVER;
      }
      return _this;
    }
    Subscriber.create = function (next, error, complete) {
      return new SafeSubscriber(next, error, complete);
    };
    Subscriber.prototype.next = function (value) {
      if (this.isStopped);
      else {
        this._next(value);
      }
    };
    Subscriber.prototype.error = function (err) {
      if (this.isStopped);
      else {
        this.isStopped = true;
        this._error(err);
      }
    };
    Subscriber.prototype.complete = function () {
      if (this.isStopped);
      else {
        this.isStopped = true;
        this._complete();
      }
    };
    Subscriber.prototype.unsubscribe = function () {
      if (!this.closed) {
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
        this.destination = null;
      }
    };
    Subscriber.prototype._next = function (value) {
      this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
      try {
        this.destination.error(err);
      } finally {
        this.unsubscribe();
      }
    };
    Subscriber.prototype._complete = function () {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    };
    return Subscriber;
  })(Subscription);
  var _bind = Function.prototype.bind;
  function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
  }
  var ConsumerObserver = (function () {
    function ConsumerObserver(partialObserver) {
      this.partialObserver = partialObserver;
    }
    ConsumerObserver.prototype.next = function (value) {
      var partialObserver = this.partialObserver;
      if (partialObserver.next) {
        try {
          partialObserver.next(value);
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    ConsumerObserver.prototype.error = function (err) {
      var partialObserver = this.partialObserver;
      if (partialObserver.error) {
        try {
          partialObserver.error(err);
        } catch (error) {
          handleUnhandledError(error);
        }
      } else {
        handleUnhandledError(err);
      }
    };
    ConsumerObserver.prototype.complete = function () {
      var partialObserver = this.partialObserver;
      if (partialObserver.complete) {
        try {
          partialObserver.complete();
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    return ConsumerObserver;
  })();
  var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(observerOrNext, error, complete) {
      var _this = _super.call(this) || this;
      var partialObserver;
      if (isFunction(observerOrNext) || !observerOrNext) {
        partialObserver = {
          next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined,
          error: error !== null && error !== void 0 ? error : undefined,
          complete: complete !== null && complete !== void 0 ? complete : undefined,
        };
      } else {
        var context_1;
        if (_this && config.useDeprecatedNextContext) {
          context_1 = Object.create(observerOrNext);
          context_1.unsubscribe = function () {
            return _this.unsubscribe();
          };
          partialObserver = {
            next: observerOrNext.next && bind(observerOrNext.next, context_1),
            error: observerOrNext.error && bind(observerOrNext.error, context_1),
            complete: observerOrNext.complete && bind(observerOrNext.complete, context_1),
          };
        } else {
          partialObserver = observerOrNext;
        }
      }
      _this.destination = new ConsumerObserver(partialObserver);
      return _this;
    }
    return SafeSubscriber;
  })(Subscriber);
  function handleUnhandledError(error) {
    {
      reportUnhandledError(error);
    }
  }
  function defaultErrorHandler(err) {
    throw err;
  }
  var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop,
  };

  function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
  }
  function operate(init) {
    return function (source) {
      if (hasLift(source)) {
        return source.lift(function (liftedSource) {
          try {
            return init(liftedSource, this);
          } catch (err) {
            this.error(err);
          }
        });
      }
      throw new TypeError('Unable to lift unknown Observable type');
    };
  }

  function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
  }
  var OperatorSubscriber = (function (_super) {
    __extends(OperatorSubscriber, _super);
    function OperatorSubscriber(
      destination,
      onNext,
      onComplete,
      onError,
      onFinalize,
      shouldUnsubscribe,
    ) {
      var _this = _super.call(this, destination) || this;
      _this.onFinalize = onFinalize;
      _this.shouldUnsubscribe = shouldUnsubscribe;
      _this._next = onNext
        ? function (value) {
            try {
              onNext(value);
            } catch (err) {
              destination.error(err);
            }
          }
        : _super.prototype._next;
      _this._error = onError
        ? function (err) {
            try {
              onError(err);
            } catch (err) {
              destination.error(err);
            } finally {
              this.unsubscribe();
            }
          }
        : _super.prototype._error;
      _this._complete = onComplete
        ? function () {
            try {
              onComplete();
            } catch (err) {
              destination.error(err);
            } finally {
              this.unsubscribe();
            }
          }
        : _super.prototype._complete;
      return _this;
    }
    OperatorSubscriber.prototype.unsubscribe = function () {
      var _a;
      if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        var closed_1 = this.closed;
        _super.prototype.unsubscribe.call(this);
        !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
      }
    };
    return OperatorSubscriber;
  })(Subscriber);

  function map(project, thisArg) {
    return operate(function (source, subscriber) {
      var index = 0;
      source.subscribe(
        createOperatorSubscriber(subscriber, function (value) {
          subscriber.next(project.call(thisArg, value, index++));
        }),
      );
    });
  }

  function applyOnEvent(result, types, fn) {
    if (result.isInBlock || result.isFinalized) {
      const records = result.filterRecords('contracts', types);
      if (records.length) {
        return fn(records);
      }
    }
    return undefined;
  }

  const EMPTY_SALT = new Uint8Array();
  function withMeta(meta, creator) {
    creator.meta = meta;
    return creator;
  }
  function createBluePrintTx(meta, fn) {
    return withMeta(meta, (options, ...params) => fn(options, params));
  }
  function encodeSalt(salt = utilCrypto.randomAsU8a()) {
    return salt instanceof types.Bytes
      ? salt
      : salt?.length
        ? util.compactAddLength(util.u8aToU8a(salt))
        : EMPTY_SALT;
  }
  function convertWeight(weight) {
    const [refTime, proofSize] = isWeightV2(weight)
      ? [weight.refTime.toBn(), weight.proofSize.toBn()]
      : [util.bnToBn(weight), undefined];
    return {
      v1Weight: refTime,
      v2Weight: { proofSize, refTime },
    };
  }
  function isWeightV2(weight) {
    return !!weight.proofSize;
  }

  const MAX_CALL_GAS = new util.BN(5_000_000_000_000).isub(util.BN_ONE);
  const l = util.logger('Contract');
  function createQuery(meta, fn) {
    return withMeta(meta, (origin, options, ...params) => fn(origin, options, params));
  }
  function createTx(meta, fn) {
    return withMeta(meta, (options, ...params) => fn(options, params));
  }
  class ContractSubmittableResult extends api.SubmittableResult {
    contractEvents;
    constructor(result, contractEvents) {
      super(result);
      this.contractEvents = contractEvents;
    }
  }
  class Contract extends Base {
    address;
    __internal__query = {};
    __internal__tx = {};
    constructor(api, abi, address, decorateMethod) {
      super(api, abi, decorateMethod);
      this.address = this.registry.createType('AccountId20', address);
      this.abi.messages.forEach(m => {
        if (util.isUndefined(this.__internal__tx[m.method])) {
          this.__internal__tx[m.method] = createTx(m, (o, p) => this.__internal__exec(m, o, p));
        }
        if (util.isUndefined(this.__internal__query[m.method])) {
          this.__internal__query[m.method] = createQuery(m, (f, o, p) =>
            this.__internal__read(m, o, p).send(f),
          );
        }
      });
    }
    get query() {
      return this.__internal__query;
    }
    get tx() {
      return this.__internal__tx;
    }
    __internal__getGas = (_gasLimit, isCall = false) => {
      const weight = convertWeight(_gasLimit);
      if (weight.v1Weight.gt(util.BN_ZERO)) {
        return weight;
      }
      return convertWeight(
        isCall
          ? MAX_CALL_GAS
          : convertWeight(
              this.api.consts.system.blockWeights
                ? this.api.consts.system.blockWeights.maxBlock
                : this.api.consts.system['maximumBlockWeight'],
            )
              .v1Weight.muln(64)
              .div(util.BN_HUNDRED),
      );
    };
    __internal__exec = (
      messageOrId,
      { gasLimit = util.BN_ZERO, storageDepositLimit = null, value = util.BN_ZERO },
      params,
    ) => {
      return this.api.tx.revive
        .call(
          this.address,
          value,
          this._isWeightV1 ? convertWeight(gasLimit).v1Weight : convertWeight(gasLimit).v2Weight,
          storageDepositLimit,
          this.abi.findMessage(messageOrId).toU8a(params),
        )
        .withResultTransform(
          result =>
            new ContractSubmittableResult(
              result,
              applyOnEvent(result, ['ContractEmitted', 'ContractExecution'], records =>
                records
                  .map(record => {
                    try {
                      return this.abi.decodeEvent(record);
                    } catch (error) {
                      l.error(`Unable to decode contract event: ${error.message}`);
                      return null;
                    }
                  })
                  .filter(decoded => !!decoded),
              ),
            ),
        );
    };
    __internal__read = (
      messageOrId,
      { gasLimit = util.BN_ZERO, storageDepositLimit = null, value = util.BN_ZERO },
      params,
    ) => {
      const message = this.abi.findMessage(messageOrId);
      return {
        send: this._decorateMethod(origin =>
          this.api.rx.call.contractsApi
            .call(
              origin,
              this.address,
              value,
              this._isWeightV1
                ? this.__internal__getGas(gasLimit, true).v1Weight
                : this.__internal__getGas(gasLimit, true).v2Weight,
              storageDepositLimit,
              message.toU8a(params),
            )
            .pipe(
              map(({ debugMessage, gasConsumed, gasRequired, result, storageDeposit }) => ({
                debugMessage,
                gasConsumed,
                gasRequired:
                  gasRequired && !convertWeight(gasRequired).v1Weight.isZero()
                    ? gasRequired
                    : gasConsumed,
                output:
                  result.isOk && message.returnType
                    ? this.abi.registry.createTypeUnsafe(
                        message.returnType.lookupName || message.returnType.type,
                        [result.asOk.data.toU8a(true)],
                        { isPedantic: true },
                      )
                    : null,
                result,
                storageDeposit,
              })),
            ),
        ),
      };
    };
  }

  class BlueprintSubmittableResult extends api.SubmittableResult {
    contract;
    constructor(result, contract) {
      super(result);
      this.contract = contract;
    }
  }
  class Blueprint extends Base {
    codeHash;
    __internal__tx = {};
    constructor(api, abi, codeHash, decorateMethod) {
      super(api, abi, decorateMethod);
      this.codeHash = this.registry.createType('Hash', codeHash);
      this.abi.constructors.forEach(c => {
        if (util.isUndefined(this.__internal__tx[c.method])) {
          this.__internal__tx[c.method] = createBluePrintTx(c, (o, p) =>
            this.__internal__deploy(c, o, p),
          );
        }
      });
    }
    get tx() {
      return this.__internal__tx;
    }
    __internal__deploy = (
      constructorOrId,
      { gasLimit = util.BN_ZERO, salt, storageDepositLimit = null, value = util.BN_ZERO },
      params,
    ) => {
      return this.api.tx.revive
        .instantiate(
          value,
          this._isWeightV1 ? convertWeight(gasLimit).v1Weight : convertWeight(gasLimit).v2Weight,
          storageDepositLimit,
          this.codeHash,
          this.abi.findConstructor(constructorOrId).toU8a(params),
          encodeSalt(salt),
        )
        .withResultTransform(
          result =>
            new BlueprintSubmittableResult(
              result,
              (() => {
                if (result.status.isInBlock || result.status.isFinalized) {
                  return new Contract(
                    this.api,
                    this.abi,
                    '0x075e2a9cfb213a68dfa1f5cf6bf6d515ae212cf8',
                    this._decorateMethod,
                  );
                }
                return undefined;
              })(),
            ),
        );
    };
  }

  class CodeSubmittableResult extends api.SubmittableResult {
    blueprint;
    contract;
    constructor(result, blueprint, contract) {
      super(result);
      this.blueprint = blueprint;
      this.contract = contract;
    }
  }
  function isValidCode(code) {
    return util.isWasm(code) || util.isRiscV(code);
  }
  class Code extends Base {
    code;
    __internal__tx = {};
    constructor(api, abi, wasm, decorateMethod) {
      super(api, abi, decorateMethod);
      this.code = isValidCode(this.abi.info.source.wasm)
        ? this.abi.info.source.wasm
        : util.u8aToU8a(wasm);
      if (!isValidCode(this.code)) {
        throw new Error('Invalid code provided');
      }
      this.abi.constructors.forEach(c => {
        if (util.isUndefined(this.__internal__tx[c.method])) {
          this.__internal__tx[c.method] = createBluePrintTx(c, (o, p) =>
            this.__internal__instantiate(c, o, p),
          );
        }
      });
    }
    get tx() {
      return this.__internal__tx;
    }
    __internal__instantiate = (
      constructorOrId,
      { gasLimit = util.BN_ZERO, salt, storageDepositLimit = null, value = util.BN_ZERO },
      params,
    ) => {
      console.log('in instantiate');
      console.log(this.abi.info.source.wasmHash);
      return this.api.tx.revive
        .instantiateWithCode(
          value,
          this._isWeightV1 ? convertWeight(gasLimit).v1Weight : convertWeight(gasLimit).v2Weight,
          storageDepositLimit,
          util.compactAddLength(this.code),
          this.abi.findConstructor(constructorOrId).toU8a(params),
          encodeSalt(salt),
        )
        .withResultTransform(
          result =>
            new CodeSubmittableResult(
              result,
              new Blueprint(
                this.api,
                this.abi,
                this.abi.info.source.wasmHash,
                this._decorateMethod,
              ),
              new Contract(
                this.api,
                this.abi,
                '0x075e2a9cfb213a68dfa1f5cf6bf6d515ae212cf8',
                this._decorateMethod,
              ),
            ),
        );
    };
  }

  class BlueprintPromise extends Blueprint {
    constructor(api$1, abi, codeHash) {
      super(api$1, abi, codeHash, api.toPromiseMethod);
    }
  }
  class CodePromise extends Code {
    constructor(api$1, abi, wasm) {
      super(api$1, abi, wasm, api.toPromiseMethod);
    }
  }
  class ContractPromise extends Contract {
    constructor(api$1, abi, address) {
      super(api$1, abi, address, api.toPromiseMethod);
    }
  }

  class BlueprintRx extends Blueprint {
    constructor(api$1, abi, codeHash) {
      super(api$1, abi, codeHash, api.toRxMethod);
    }
  }
  class CodeRx extends Code {
    constructor(api$1, abi, wasm) {
      super(api$1, abi, wasm, api.toRxMethod);
    }
  }
  class ContractRx extends Contract {
    constructor(api$1, abi, address) {
      super(api$1, abi, address, api.toRxMethod);
    }
  }

  exports.Abi = Abi;
  exports.BlueprintPromise = BlueprintPromise;
  exports.BlueprintRx = BlueprintRx;
  exports.CodePromise = CodePromise;
  exports.CodeRx = CodeRx;
  exports.ContractPromise = ContractPromise;
  exports.ContractRx = ContractRx;
  exports.packageInfo = packageInfo;
});
