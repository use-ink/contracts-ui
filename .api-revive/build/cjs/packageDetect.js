'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const packageInfo_1 = require('@polkadot/api/cjs/packageInfo');
const packageInfo_2 = require('@polkadot/types/cjs/packageInfo');
const util_1 = require('@polkadot/util');
const packageInfo_js_1 = require('./packageInfo.js');
(0, util_1.detectPackage)(packageInfo_js_1.packageInfo, null, [
  packageInfo_1.packageInfo,
  packageInfo_2.packageInfo,
]);
