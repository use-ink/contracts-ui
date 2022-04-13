// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Dropdown } from 'ui/components';
import { useTheme } from 'ui/contexts';
import { Page } from 'ui/templates';

const options = [
  {
    label: 'Light',
    value: 'light',
  },
  {
    label: 'Dark',
    value: 'dark',
  },
];

export function Settings() {
  const { theme, setTheme } = useTheme();
  return (
    <Page header="Settings" help={<>Manage settings and preferences.</>}>
      <div className="pb-10 border-b border-gray-200 dark:border-gray-800 mt-4 dark:text-white text-gray-600">
        <h2 className="text-lg pb-1 mb-2">Appearance</h2>
        <div className="grid grid-cols-12 w-full">
          <div className="flex flex-col col-span-6 lg:col-span-7 2xl:col-span-8 text-sm">
            <span className="font-semibold">Theme mode</span>
            <span className="dark:text-gray-400 text-gray-500">Select a display theme</span>
          </div>
          <div className="col-span-6 lg:col-span-5 2xl:col-span-4">
            <Dropdown
              onChange={e => setTheme && setTheme(e as 'light' | 'dark')}
              options={options}
              value={theme}
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
