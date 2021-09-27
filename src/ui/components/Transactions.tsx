
import { CheckIcon, ExclamationCircleIcon, RefreshIcon, XIcon } from '@heroicons/react/outline';
import React from 'react';
import { TransactionsState } from 'types';
// import { Transaction } from 'types';
import { classes } from 'ui/util';

type Props = React.HTMLAttributes<HTMLDivElement> & TransactionsState

export function Transactions ({ className, dismiss, txs }: Props) {
  return (
    <div className={classes('z-10 fixed right-3 top-3 w-80', className)}>
      {txs.map(({ extrinsic, id, isComplete, isProcessing, isSuccess, isError }) => {

        const [icon, text] = ((): [React.ReactNode, React.ReactNode] => {
          if (isSuccess) {
            return [
              <CheckIcon key='success' className="dark:text-green-400 w-12 h-12 pr-2" />,
              'complete!'
            ];
          }

          if (isError) {
            return [
              <ExclamationCircleIcon key='error' className="dark:text-red-400 w-12 h-12 pr-2" />,
              'error'
            ]
          }

          return [
            <RefreshIcon key='queued' className={classes('dark:text-blue-500 w-12 h-12 pr-2', true && 'animate-spin')} />,
            isProcessing ? 'waiting...' : 'queued'
          ]
        })()

        return (
          <div key={id} className='max-w-full dark:bg-elevation-3 dark:text-white p-3 flex items-center'>
            {icon}
            <div className='flex-grow text-sm'>
              <div>
                {extrinsic.registry.findMetaCall(extrinsic.callIndex).method}
              </div>
              <div className='dark:text-gray-400'>
                {text}
              </div>
            </div>
            {isComplete && (
              <XIcon
                className="dark:text-gray-400 w-4 h-4"
                onClick={() => dismiss(id)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}