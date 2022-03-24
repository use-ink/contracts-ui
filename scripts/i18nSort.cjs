/* eslint-disable header/header */
// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');

const i18nRoot = path.join(__dirname, '../src/i18n/locales');

function sortLanguage(lang) {
  const langFile = path.join(i18nRoot, lang);

  const json = require(langFile);
  const sorted = Object.keys(json)
    .sort()
    .reduce((result, key) => {
      result[key] = json[key];

      return result;
    }, {});

  fs.writeFileSync(langFile, JSON.stringify(sorted, null, 2));
}

function checkLanguages() {
  const languages = fs
    .readdirSync(i18nRoot)
    .filter(entry => !['.', '..'].includes(entry))
    .sort();

  languages.forEach(sortLanguage);

  // fs.writeFileSync(path.join(i18nRoot, 'index.json'), JSON.stringify(languages, null, 2));
}

checkLanguages();
