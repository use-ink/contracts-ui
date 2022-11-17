// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SidePanel } from '../common/SidePanel';
import { TransactionResult } from './TransactionResult';
import { DryRunResult } from './DryRunResult';
import { CallResult, ContractExecResult, Registry, AbiMessage } from 'types';

interface Props {
  results: CallResult[];
  registry: Registry;
  message: AbiMessage;
  outcome?: ContractExecResult;
}

export const ResultsOutput = ({ registry, results, outcome, message }: Props) => {
  return (
    <>
      <SidePanel
        header={message.isMutating || message.isPayable ? 'Dry-run outcome' : 'Outcome'}
        emptyView="No results yet."
      >
        <div className="text-xs p-4 break-all whitespace-pre-wrap">
          {outcome && <DryRunResult outcome={outcome} message={message} registry={registry} />}
        </div>
      </SidePanel>
      <SidePanel header="Transactions log" emptyView="No transactions yet.">
        {results
          .map(result => {
            const { time } = result;
            const date = new Date(time).toLocaleString();
            return <TransactionResult key={time} result={result} date={date} registry={registry} />;
          })
          .reverse()}
      </SidePanel>
    </>
  );
};
