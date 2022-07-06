// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BellIcon, XIcon } from '@heroicons/react/outline';
import { NotificationIcon } from './common/NotificationIcon';
import type { QueuedTxOptions, TransactionsState } from 'types';
import { classes, isEmptyObj } from 'ui/util';

export function Transactions({
  dismiss,
  txs,
}: React.HTMLAttributes<HTMLDivElement> & TransactionsState) {
  return (
    <div className={classes('z-10 fixed right-3 top-3 w-80')}>
      {Object.entries(txs).map(([id, tx]: [string, QueuedTxOptions | undefined]) => {
        const { status, events, extrinsic } = tx || {};
        const isComplete = status === 'error' || status === 'success';

        return (
          <div key={`notification-${id}`}>
            <div
              data-cy="transaction-queued"
              key={id}
              className="max-w-full dark:bg-elevation-2 dark:text-white bg-gray-200 text-gray-600 p-3 flex items-center"
            >
              <NotificationIcon status={status} />
              <div className="pl-2 flex-grow text-sm">
                <div>{extrinsic?.registry.findMetaCall(extrinsic.callIndex).method}</div>
                <div className="text-gray-400">{status}</div>
              </div>
              {isComplete && (
                <XIcon
                  className="text-gray-400 w-4 h-4"
                  onClick={() => dismiss(parseInt(id))}
                  data-cy="dismiss-notification"
                />
              )}
            </div>
            {isComplete && events && !isEmptyObj(events) && (
              <div
                className="max-w-full dark:bg-elevation-2 dark:text-white bg-gray-200 text-gray-600 p-3 mt-2 flex items-center"
                data-cy="transaction-complete"
              >
                <BellIcon className="text-yellow-400 w-12 h-12" />
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
                <XIcon className="text-gray-400 w-4 h-4" onClick={() => dismiss(parseInt(id))} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
