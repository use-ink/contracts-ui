import React from 'react';
import { DatabaseIcon, CashIcon } from '@heroicons/react/solid';
import { CallResult } from 'types';

interface Props {
  result: CallResult;
  date: string;
}
export const TransactionResult = ({
  result: { time, data, method, isMutating, isPayable, blockHash, info, error },
  date,
}: Props) => {
  return (
    <div
      key={`${time}`}
      className="text-xs text-gray-400 break-all p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="mb-2">{date}</div>
      <div className="flex-col">
        <div className="text-mono flex mb-4">
          <span className="text-yellow-300">{method}</span>
          <span>{`()`}</span>
          {isMutating && <DatabaseIcon className="w-4 h-4 ml-2" />}
          {isPayable && <CashIcon className="w-4 h-4 ml-2" />}
        </div>
        <div className="text-mono mb-2">{`${data}`}</div>
        <div className="text-mono mb-2">
          {`Included at block# ${blockHash?.slice(0, 6)}...${blockHash?.slice(-4)}`}
        </div>
        <div className="text-mono mb-2">{`Weight: ${info?.weight}`}</div>
        {error && (
          <div className="bg-elevation-1 p-2 flex-1 rounded-sm text-mono">
            {error.docs.map((doc, index) => (
              <p key={index}>{doc}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
