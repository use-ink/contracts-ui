// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChevronRightIcon, TrashIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { SimpleSpread, VoidFn } from 'types';
import { useApi, useDatabase } from 'ui/contexts';
import { classes, truncate } from 'ui/util';
import { checkOnChainCode } from 'api/util';

type Props = SimpleSpread<
  React.HTMLAttributes<HTMLButtonElement>,
  {
    codeHash: string;
    name?: string;
    error?: React.ReactNode;
    isError?: boolean;
    isSuccess?: boolean;
    onClick?: VoidFn;
    onDelete?: VoidFn;
  }
>;

export function CodeHash({ className, codeHash, error, name, isError, isSuccess, onClick }: Props) {
  const { api } = useApi();
  const { db } = useDatabase();
  const [isOnChain, setIsOnChain] = useState(true);

  useEffect(() => {
    checkOnChainCode(api, codeHash)
      .then(codeStorageExists => {
        setIsOnChain(codeStorageExists ? true : false);
      })
      .catch(console.error);
  }, [api, codeHash]);

  return (
    <div
      className={classes(
        'group flex items-center dark:bg-elevation-1 dark:border-gray-700 border p-4 rounded',
        isOnChain &&
          onClick &&
          'cursor-pointer dark:hover:bg-opacity-10 dark:hover:bg-blue-700 dark:hover:border-blue-500',
        isError && 'dark:bg-opacity-20 dark:bg-red-900 dark:border-red-500',
        isSuccess && isOnChain && 'dark:bg-opacity-20 dark:bg-green-900 dark:border-green-500',
        className
      )}
      onClick={isOnChain && onClick ? onClick : undefined}
    >
      <div className={classes('flex-1', !isOnChain && 'opacity-40')}>
        <div className="dark:text-white mb-1">
          {!isError ? name || 'On-chain Code Hash' : 'Invalid Code Hash'}
        </div>
        {codeHash && !isError && (
          <div className="dark:text-gray-500 text-sm">Code hash: {truncate(codeHash)}</div>
        )}
        {isError && <div className="dark:text-gray-500 text-sm">{error}</div>}
      </div>
      {onClick && isOnChain && (
        <ChevronRightIcon className="h-5 w-5 dark:text-gray-500 text-gray-400 dark:group-hover:border-blue-500" />
      )}
      {!isOnChain && (
        <>
          <span className="text-red-400 text-xs font-semibold mr-3">Not on-chain</span>
          <button
            title="Forget code hash"
            className="flex font-semibold items-center dark:text-gray-300 dark:bg-elevation-1 dark:hover:bg-elevation-2 dark:border-gray-700 text-gray-500 hover:text-gray-400 border h-full p-1 rounded"
            onClick={async () => {
              const toDelete = await db.codeBundles.get({ codeHash });

              if (toDelete?.id) {
                await db.codeBundles.delete(toDelete.id);
              }
            }}
          >
            <TrashIcon className="w-4 dark:text-gray-500 mr-1 justify-self-end" />
          </button>
        </>
      )}
    </div>
  );
}
