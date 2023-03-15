// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Setting } from './Setting';
import { Dropdown } from 'ui/components';
import { useTheme } from 'ui/contexts';

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

export function ThemeMode() {
  const { theme, setTheme } = useTheme();
  return (
    <Setting label="Theme mode" description="Select a display theme">
      <Dropdown
        onChange={e => setTheme && setTheme(e as 'light' | 'dark')}
        options={options}
        value={theme}
      />
    </Setting>
  );
}
