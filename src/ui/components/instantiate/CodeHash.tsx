// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChevronRightIcon } from '@heroicons/react/outline';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleSpread, VoidFn } from 'types';
import { classes, truncate } from 'ui/util';

type Props = SimpleSpread<
  React.HTMLAttributes<HTMLButtonElement>,
  {
    codeHash: string;
    name?: string;
    error?: React.ReactNode;
    isError?: boolean;
    isSuccess?: boolean;
    onClick?: VoidFn;
  }
>;

export function CodeHash({ className, codeHash, error, name, isError, isSuccess, onClick }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className={classes(
        'group flex items-center dark:bg-elevation-1 dark:border-gray-700 border p-4 rounded',
        onClick &&
          'cursor-pointer dark:hover:bg-opacity-10 dark:hover:bg-blue-700 dark:hover:border-blue-500',
        isError && 'dark:bg-opacity-20 dark:bg-red-900 dark:border-red-500',
        isSuccess && 'dark:bg-opacity-20 dark:bg-green-900 dark:border-green-500',
        className
      )}
      onClick={onClick && onClick}
    >
      <div className="flex-1">
        <div className="dark:text-white mb-1">
          {!isError ? name || 'On-chain Code Hash' : 'Invalid Code Hash'}
        </div>
        {codeHash && !isError && (
          <div className="dark:text-gray-500 text-sm">
            {t('codeHash', 'Code hash')}
            {': '}
            {truncate(codeHash)}
          </div>
        )}
        {isError && (
          <div className="dark:text-gray-500 text-sm">
            {error || t('codeHashNotOnChain', 'This code hash is not on-chain')}
          </div>
        )}
      </div>
      {onClick && (
        <ChevronRightIcon className="h-5 w-5 dark:text-gray-500 text-gray-400 dark:group-hover:border-blue-500" />
      )}
    </div>
  );
}
