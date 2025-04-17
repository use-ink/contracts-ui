import { Bytes } from '@polkadot/types';
import { bnToBn, compactAddLength, u8aToU8a } from '@polkadot/util';
import { randomAsU8a } from '@polkadot/util-crypto';
export const EMPTY_SALT = new Uint8Array();
export function withMeta(meta, creator) {
  creator.meta = meta;
  return creator;
}
export function createBluePrintTx(meta, fn) {
  return withMeta(meta, (options, ...params) => fn(options, params));
}
export function createBluePrintWithId(fn) {
  return (constructorOrId, options, ...params) => fn(constructorOrId, options, params);
}
export function encodeSalt(salt = randomAsU8a()) {
  return salt instanceof Bytes
    ? salt
    : salt?.length
      ? compactAddLength(u8aToU8a(salt))
      : EMPTY_SALT;
}
export function convertWeight(weight) {
  const [refTime, proofSize] = isWeightV2(weight)
    ? [weight.refTime.toBn(), weight.proofSize.toBn()]
    : [bnToBn(weight), undefined];
  return {
    v1Weight: refTime,
    v2Weight: { proofSize, refTime },
  };
}
export function isWeightV2(weight) {
  return !!weight.proofSize;
}
