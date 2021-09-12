import React from 'react';
import { DatabaseIcon, CashIcon } from '@heroicons/react/solid';
import { CallResult } from 'types';

interface Props {
  results: CallResult[];
}
export const ResultsOutput = ({ results }: Props) => {
  return (
    <div className="mb-8 border rounded-md border-gray-200 dark:border-gray-700">
      <div className="text-sm rounded-t-md border-b text-gray-300 border-gray-200 dark:border-gray-700 bg-elevation-1 p-4">
        Call Results
      </div>
      <div>
        {results
          .map(({ time, data, method, returnType, isMutating, isPayable, blockHash, info }) => {
            const date = new Date(time).toLocaleString();
            return isMutating || isPayable ? (
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
                </div>
              </div>
            ) : (
              <div
                key={`${time}`}
                className="text-xs text-gray-400 break-all p-4 border-b border-gray-200 dark:border-gray-700"
              >
                <div className="mb-2">{date}</div>
                <div className="flex items-center">
                  <div className="text-mono flex-1">
                    <span className="text-yellow-300">{method}</span>
                    <span>{`(): ${returnType}`}</span>
                  </div>
                  <div className="bg-elevation-1 p-2 flex-1 rounded-sm text-mono">{`${data}`}</div>
                </div>
              </div>
            );
          })
          .reverse()}
      </div>
    </div>
  );
};
