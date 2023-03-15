// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CustomEndpoint, ThemeMode } from '../components/settings';
import { Page } from 'ui/templates';

export function Settings() {
  return (
    <Page header="Settings" help={<>Manage settings and preferences.</>}>
      <div className="grid gap-4 pb-10 border-b border-gray-200 dark:border-gray-800 mt-4 dark:text-white text-gray-600">
        <h2 className="text-lg pb-1 mb-2">Appearance</h2>
        <ThemeMode />
      </div>

      <div className="pb-10 border-b border-gray-200 dark:border-gray-800 mt-4 dark:text-white text-gray-600">
        <h2 className="text-lg pb-1 mb-2">Local Node</h2>
        <CustomEndpoint />
      </div>
    </Page>
  );
}
