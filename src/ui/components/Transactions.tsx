// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BellIcon, XIcon } from '@heroicons/react/outline';
import React from 'react';
import { NotificationIcon } from './common/NotificationIcon';
import type { TransactionsState } from 'types';
import { classes } from 'ui/util';

export function Transactions({
  dismiss,
  txs,
}: React.HTMLAttributes<HTMLDivElement> & TransactionsState) {
  const Notifications: JSX.Element[] = [];
  for (const id in txs) {
    const { extrinsic, status, events } = txs[id];
    const isComplete = status === 'error' || status === 'success';

    Notifications.push(
      <>
        <div
          key={id}
          className="max-w-full dark:bg-elevation-3 dark:text-white p-3 flex items-center"
        >
          <NotificationIcon status={status} />
          <div className="pl-2 flex-grow text-sm">
            <div>{extrinsic.registry.findMetaCall(extrinsic.callIndex).method}</div>
            <div className="dark:text-gray-400">{status}</div>
          </div>
          {isComplete && (
            <XIcon className="dark:text-gray-400 w-4 h-4" onClick={() => dismiss(parseInt(id))} />
          )}
        </div>
        {isComplete && (
          <div className="max-w-full dark:bg-elevation-3 dark:text-white p-3 mt-2 flex items-center">
            <BellIcon className="dark:text-yellow-400 w-12 h-12" />
            <div className="pl-2 flex-grow text-sm">
              {Object.keys(events).map(eventName => {
                const times = events[eventName] > 1 ? ` (x${events[eventName]})` : '';
                return (
                  <div key={eventName} className="dark:text-gray-400">
                    {`${eventName}${times}`}
                  </div>
                );
              })}
            </div>
            <XIcon className="dark:text-gray-400 w-4 h-4" onClick={() => dismiss(parseInt(id))} />
          </div>
        )}
      </>
    );
  }

  return <div className={classes('z-10 fixed right-3 top-3 w-80')}>{...Notifications}</div>;
}
