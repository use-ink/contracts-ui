// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { Dropdown } from 'ui/components';
import { useTheme } from 'ui/contexts';
import { useLocalStorage } from 'ui/hooks';
import { Page } from 'ui/templates';

const themeOptions = (t: TFunction) => [
  {
    label: t('settingsThemeLight', 'Light'),
    value: 'light',
  },
  {
    label: t('settingsThemeDark', 'Dark'),
    value: 'dark',
  },
];

const i18nextLngOptions = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Deutsch',
    value: 'de',
  },
];

function Field({
  children,
  help,
  title,
}: React.PropsWithChildren<{ title: React.ReactNode; help: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-12 w-full mb-2">
      <div className="flex flex-col col-span-6 lg:col-span-7 2xl:col-span-8 text-sm">
        <span className="font-semibold">{title}</span>
        <span className="dark:text-gray-400 text-gray-500">{help}</span>
      </div>
      <div className="col-span-6 lg:col-span-5 2xl:col-span-4">{children}</div>
    </div>
  );
}

export function Settings() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [i18nextLng, setI18nextLng] = useLocalStorage<string>('i18nextLng', 'en');

  return (
    <Page
      header={t('settingsTitle', 'Settings')}
      help={t('settingsHelp', 'Manage settings and preferences.')}
    >
      <div className="pb-10 border-b border-gray-200 dark:border-gray-800 mt-4 dark:text-white text-gray-600">
        <h2 className="text-lg pb-1 mb-2">{t('settingsGeneral', 'General')}</h2>
        <Field
          title={t('settingsLanguageTitle', 'Language')}
          help={t('settingsLanguageHelp', 'Select a preferred language')}
        >
          <Dropdown
            isDisabled
            onChange={e => {
              setI18nextLng && setI18nextLng(e as string);

              i18n
                .changeLanguage(e as string)
                .then()
                .catch(console.error);
            }}
            options={i18nextLngOptions}
            value={i18nextLng}
          />
        </Field>
        <Field
          title={t('settingsThemeTitle', 'Theme')}
          help={t('settingsThemeHelp', 'Select a display theme')}
        >
          <Dropdown
            onChange={e => setTheme && setTheme(e as 'light' | 'dark')}
            options={themeOptions(t)}
            value={theme}
          />
        </Field>
      </div>
    </Page>
  );
}
