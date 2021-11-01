// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Identicon } from '@polkadot/react-identicon';
import { useAccount } from 'ui/hooks/useAccount';
import { classes } from 'ui/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  name?: React.ReactNode;
  value?: string | null;
}

export function Account({ className, name: propsName, value }: Props) {
  const account = useAccount(value);

  const name = propsName || account?.meta.name || 'Account';

  return (
    <div className={classes('p-1.5 flex items-center w-full', className)}>
      <Identicon size={32} value={value} className="pr-2" />
      <div className="flex-1 block truncate">
        <span className="flex font-semibold text-base dark:text-gray-300 text-gray-700">
          {name}
        </span>
        <p className="text-gray-500 text-xs">
          {String(value).slice(0, 4) + '...' + String(value).slice(-4)}
        </p>
      </div>
    </div>
  );
}
