// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SidePanel } from '../common/SidePanel';
import { QueryResult } from './QueryResult';
import { TransactionResult } from './TransactionResult';
import { CallResult } from 'types';

interface Props {
  results: CallResult[];
}

export const ResultsOutput = ({ results }: Props) => {
  return (
    <SidePanel header="Call Results" emptyView="No results yet.">
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
    </SidePanel>
  );
};
