// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  BellIcon,
  CheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import React from 'react';
import { Spinner } from './common/Spinner';
import type { TransactionsState } from 'types';
import { classes } from 'ui/util';

type Props = React.HTMLAttributes<HTMLDivElement> & TransactionsState;

export function Transactions({ className, dismiss, txs }: Props) {
  return (
    <div className={classes('z-10 fixed right-3 top-3 w-80', className)}>
      {txs.map(({ extrinsic, id, isComplete, isProcessing, isSuccess, isError, events }) => {
        const [icon, text] = ((): [React.ReactNode, React.ReactNode] => {
          if (isSuccess) {
            return [
              <CheckIcon key="success" className="dark:text-green-400 w-12 h-12" />,
              'complete!',
            ];
          }

          if (isError) {
            return [
              <ExclamationCircleIcon key="error" className="dark:text-red-400 w-12 h-12" />,
              'error',
            ];
          }

          if (isProcessing) {
            return [<Spinner key="processing" width={12} strokeWidth={4} />, 'processing...'];
          }

          return [
            <ClockIcon key="queued" className={classes('dark:text-blue-500 w-12 h-12')} />,
            'queued',
          ];
        })();

        return (
          <>
            <div
              key={id}
              className="max-w-full dark:bg-elevation-3 dark:text-white p-3 flex items-center"
            >
              {icon}
              <div className="pl-2 flex-grow text-sm">
                <div>{extrinsic.registry.findMetaCall(extrinsic.callIndex).method}</div>
                <div className="dark:text-gray-400">{text}</div>
              </div>
              {isComplete && (
                <XIcon className="dark:text-gray-400 w-4 h-4" onClick={() => dismiss(id)} />
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
                <XIcon className="dark:text-gray-400 w-4 h-4" onClick={() => dismiss(id)} />
              </div>
            )}
          </>
        );
      })}
    </div>
  );
}
