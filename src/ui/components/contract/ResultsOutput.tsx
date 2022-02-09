// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { QueryResult } from './QueryResult';
import { TransactionResult } from './TransactionResult';
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
          .map(result => {
            const {
              message: { isMutating, isPayable },
              time,
            } = result;
            const date = new Date(time).toLocaleString();
            return isMutating || isPayable ? (
              <TransactionResult key={time} result={result} date={date} />
            ) : (
              <QueryResult key={time} result={result} date={date} />
            );
          })
          .reverse()}
        {results.length === 0 && <p className="p-4 text-gray-400 text-xs">No results yet.</p>}
      </div>
    </div>
  );
};
