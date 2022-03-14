// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const typescript = require('typescript');

function transform (file, enc, done) {
  const { ext } = path.parse(file.path);

  if (ext === '.tsx') {
    const { outputText } = typescript.transpileModule(fs.readFileSync(file.path, enc), {
      compilerOptions: { target: 'es2018' },
      fileName: path.basename(file.path)
    });

    this.parser.parseFuncFromString(outputText, (key, options) => {
      // options.defaultValue = key;

      this.parser.set(key, options);
    });

    this.parser.parseTransFromString(outputText, (key, options) => {
      this.parser.set(key, options);
    })
  }

  done();
}

module.exports = {
  input: [
    'src/**/*.{ts,tsx}',
    // Use ! to filter out files or directories
    '!src/i18n/**',
    '!node_modules/**'
  ],
  options: {
    debug: true,
    defaultLng: 'en',
    func: {
      extensions: ['.tsx', '.ts'],
      list: ['t', 'i18next.t', 'i18n.t']
    },
    keySeparator: false, // key separator
    lngs: ['en'],
    ns: 'contracts-ui',
    nsSeparator: false, // namespace separator
    resource: {
      jsonIndent: 2,
      lineEnding: '\n',
      loadPath: 'src/i18n/locales/{{lng}}.json',
      savePath: 'src/i18n/locales/{{lng}}.json'
    },
    trans: {
      component: 'Trans',
    }
  },
  output: './',
  transform
};
