import { v0ToV1 } from './toV1.js';
import { v1ToV2 } from './toV2.js';
import { v2ToV3 } from './toV3.js';
import { v3ToV4 } from './toV4.js';
export const enumVersions = ['V6', 'V5', 'V4', 'V3', 'V2', 'V1'];
function createConverter(next, step) {
  return (registry, input) => next(registry, step(registry, input));
}
export function v6ToLatestCompatible(_registry, v6) {
  return v6;
}
export function v5ToLatestCompatible(_registry, v5) {
  return v5;
}
export function v4ToLatestCompatible(_registry, v4) {
  return v4;
}
export const v3ToLatestCompatible = /*#__PURE__*/ createConverter(v4ToLatestCompatible, v3ToV4);
export const v2ToLatestCompatible = /*#__PURE__*/ createConverter(v3ToLatestCompatible, v2ToV3);
export const v1ToLatestCompatible = /*#__PURE__*/ createConverter(v2ToLatestCompatible, v1ToV2);
export const v0ToLatestCompatible = /*#__PURE__*/ createConverter(v1ToLatestCompatible, v0ToV1);
export const convertVersions = [
  ['V6', v6ToLatestCompatible],
  ['V5', v5ToLatestCompatible],
  ['V4', v4ToLatestCompatible],
  ['V3', v3ToLatestCompatible],
  ['V2', v2ToLatestCompatible],
  ['V1', v1ToLatestCompatible],
  ['V0', v0ToLatestCompatible],
];
