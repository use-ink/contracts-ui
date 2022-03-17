// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Identicon } from './Identicon';
import { classes, truncate } from 'ui/util';
import { OrFalsy } from 'types';
import { useAccount } from 'ui/hooks/useAccount';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  name?: React.ReactNode;
  value: OrFalsy<string>;
}

export function Account({ className, name: propsName, value }: Props) {
  const { t } = useTranslation();
  const account = useAccount(value);
  const name = propsName || account?.meta.name || t('account', 'Account');

  if (!value) {
    return null;
  }

  return (
    <div className={classes('p-1.5 flex items-center w-full', className)}>
      <Identicon size={42} value={value} className="pr-2" />
      <div className="flex-1 block truncate">
        <span className="flex font-semibold text-base dark:text-gray-300 text-gray-700">
          {name}
        </span>
        <p className="text-gray-500 text-xs">{truncate(value, 4)}</p>
      </div>
    </div>
  );
}
