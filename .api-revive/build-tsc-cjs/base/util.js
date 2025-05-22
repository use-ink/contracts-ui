'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.EMPTY_SALT = void 0;
exports.withMeta = withMeta;
exports.createBluePrintTx = createBluePrintTx;
exports.createBluePrintWithId = createBluePrintWithId;
exports.encodeSalt = encodeSalt;
exports.convertWeight = convertWeight;
exports.isWeightV2 = isWeightV2;
const types_1 = require('@polkadot/types');
const util_1 = require('@polkadot/util');
const util_crypto_1 = require('@polkadot/util-crypto');
exports.EMPTY_SALT = new Uint8Array();
function withMeta(meta, creator) {
  creator.meta = meta;
  return creator;
}
function createBluePrintTx(meta, fn) {
  return withMeta(meta, (options, ...params) => fn(options, params));
}
function createBluePrintWithId(fn) {
  return (constructorOrId, options, ...params) => fn(constructorOrId, options, params);
}
function encodeSalt(salt = (0, util_crypto_1.randomAsU8a)()) {
  return salt instanceof types_1.Bytes
    ? salt
    : salt?.length
      ? (0, util_1.compactAddLength)((0, util_1.u8aToU8a)(salt))
      : exports.EMPTY_SALT;
}
function convertWeight(weight) {
  const [refTime, proofSize] = isWeightV2(weight)
    ? [weight.refTime.toBn(), weight.proofSize.toBn()]
    : [(0, util_1.bnToBn)(weight), undefined];
  return {
    v1Weight: refTime,
    v2Weight: { proofSize, refTime },
  };
}
function isWeightV2(weight) {
  return !!weight.proofSize;
}
