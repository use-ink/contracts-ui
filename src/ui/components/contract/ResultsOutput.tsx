// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SidePanel } from '../common/SidePanel';
import { TransactionResult } from './TransactionResult';
import { DryRunResult } from './DryRunResult';
import { CallResult, ContractExecResult, Registry, AbiMessage } from 'types';

interface ResultsOutputProps {
  results: CallResult[];
  registry: Registry;
  message: AbiMessage;
  outcome?: ContractExecResult;
}

export function ResultsOutput({ registry, results, outcome, message }: ResultsOutputProps) {
  return (
    <>
      <SidePanel
        emptyView="No results yet."
        header={message.isMutating || message.isPayable ? 'Dry-run outcome' : 'Outcome'}
      >
        <div className="whitespace-pre-wrap break-all p-4 text-xs">
          {outcome && <DryRunResult message={message} outcome={outcome} registry={registry} />}
        </div>
      </SidePanel>
      <SidePanel emptyView="No transactions yet." header="Transactions log">
        {results
          .map(result => {
            const { time } = result;
            const date = new Date(time).toLocaleString();
            return <TransactionResult date={date} key={time} registry={registry} result={result} />;
          })
          .reverse()}
      </SidePanel>
    </>
  );
}
