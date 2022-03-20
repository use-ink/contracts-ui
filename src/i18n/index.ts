// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import de from './locales/de.json';

// eslint-disable-next-line
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: en,
      },
      de: {
        translation: de,
      },
    },
    fallbackLng: 'en',
    detection: {
      order: ['path', 'localStorage', 'htmlTag', 'cookie'],
      caches: ['localStorage'], // cache user language on
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })
  .catch(console.error);

export default i18n;
