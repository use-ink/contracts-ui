// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { useTranslation } from 'react-i18next';
import { QueryResult } from './QueryResult';
import { TransactionResult } from './TransactionResult';
import { CallResult } from 'types';

interface Props {
  results: CallResult[];
}
export const ResultsOutput = ({ results }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8 border rounded-md border-gray-200 dark:border-gray-700">
      <div className="text-sm rounded-t-md border-b dark:text-gray-300 text-gray-600 border-gray-200 dark:border-gray-700 dark:bg-elevation-1 p-4">
        {t('callResults', 'Call Results')}
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
        {results.length === 0 && (
          <p className="p-4 text-gray-400 text-xs">{t('noResultsYet', 'No results yet.')}</p>
        )}
      </div>
    </div>
  );
};
