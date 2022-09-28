// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import { SidePanel } from '../common/SidePanel';
import { TransactionResult } from './TransactionResult';
import { DryRunResult } from './DryRunResult';
import { DryRunError } from './DryRunError';
import { CallResult, Registry } from 'types';

interface Props {
  results: CallResult[];
  registry: Registry;
  message: AbiMessage;
  outcome?: ContractCallOutcome;
}

export const ResultsOutput = ({ registry, results, outcome, message }: Props) => {
  const error = outcome?.result.isErr
    ? registry.findMetaError(outcome?.result.asErr.asModule)
    : undefined;

  const debugMessage = JSON.stringify(outcome?.debugMessage.toHuman() ?? '');
  return (
    <>
      <SidePanel
        header={message.isMutating || message.isPayable ? 'Dry-run outcome' : 'Outcome'}
        emptyView="No results yet."
      >
        <div className="text-xs p-4 break-all">
          {
            <>
              {error ? (
                <DryRunError debugMessage={debugMessage} error={error} />
              ) : (
                outcome && <DryRunResult outcome={outcome} message={message} />
              )}
            </>
          }
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
