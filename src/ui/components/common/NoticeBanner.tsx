// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'ui/contexts';

export function NoticeBanner() {
  const { endpoint } = useApi();
  return (
    <div className="bg-red-500 text-gray-800 fixed bottom-0 left-56 right-1 p-2 z-50 text-center flex flex-col justify-center items-center text-xs">
      <p>
        This is an older Contracts UI version meant to provide backwards compatibility for WeightV1.
        If you experience isssues use the{' '}
        <a href={`https://contracts-ui.substrate.io/?rpc=${endpoint}`} className="text-white">
          live version
        </a>{' '}
        instead.
      </p>
    </div>
  );
}
