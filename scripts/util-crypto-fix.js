// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import path from 'path';
import fs from 'fs';

function applyHDKDFix (libName) {
  const filePath = path.resolve(`node_modules/@polkadot/util-crypto/${libName}/deriveHard.js`);
  // const secp256k1Path = path.resolve('node_modules/@polkadot/util-crypto/secp256k1/deriveHard.js')

  fs.readFile(filePath, 'utf8', function (err,data) {
    console.log(data);
    if (err) {
      return console.log(err);
    }
    var result = data.replace(
      /\n(const HDKD = compactAddLength\(stringToU8a\('.*'\)\);)\n(export function .*\(seed, chainCode\) {)\n/gm,
      `\n$2\n  $1\n`
    );
  
    fs.writeFile(filePath, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}

function main() {
  console.log('Correcting util-crypto TextEncoder issue...');
  applyHDKDFix('nacl');
  applyHDKDFix('secp256k1');
}

main();
