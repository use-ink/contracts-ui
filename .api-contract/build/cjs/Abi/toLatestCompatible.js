'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.convertVersions =
  exports.v0ToLatestCompatible =
  exports.v1ToLatestCompatible =
  exports.v2ToLatestCompatible =
  exports.v3ToLatestCompatible =
  exports.enumVersions =
    void 0;
exports.v6ToLatestCompatible = v6ToLatestCompatible;
exports.v5ToLatestCompatible = v5ToLatestCompatible;
exports.v4ToLatestCompatible = v4ToLatestCompatible;
const toV1_js_1 = require('./toV1.js');
const toV2_js_1 = require('./toV2.js');
const toV3_js_1 = require('./toV3.js');
const toV4_js_1 = require('./toV4.js');
exports.enumVersions = ['V6', 'V5', 'V4', 'V3', 'V2', 'V1'];
function createConverter(next, step) {
  return (registry, input) => next(registry, step(registry, input));
}
function v6ToLatestCompatible(_registry, v6) {
  return v6;
}
function v5ToLatestCompatible(_registry, v5) {
  return v5;
}
function v4ToLatestCompatible(_registry, v4) {
  return v4;
}
exports.v3ToLatestCompatible = createConverter(v4ToLatestCompatible, toV4_js_1.v3ToV4);
exports.v2ToLatestCompatible = createConverter(exports.v3ToLatestCompatible, toV3_js_1.v2ToV3);
exports.v1ToLatestCompatible = createConverter(exports.v2ToLatestCompatible, toV2_js_1.v1ToV2);
exports.v0ToLatestCompatible = createConverter(exports.v1ToLatestCompatible, toV1_js_1.v0ToV1);
exports.convertVersions = [
  ['V6', v6ToLatestCompatible],
  ['V5', v5ToLatestCompatible],
  ['V4', v4ToLatestCompatible],
  ['V3', exports.v3ToLatestCompatible],
  ['V2', exports.v2ToLatestCompatible],
  ['V1', exports.v1ToLatestCompatible],
  ['V0', exports.v0ToLatestCompatible],
];
