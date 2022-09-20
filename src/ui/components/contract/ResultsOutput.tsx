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
  const error = outcome?.result.isErr ? outcome?.result.asErr.asModule : undefined;
  const decodedErr = error && registry.findMetaError(error);
  const debugMessage = outcome?.debugMessage.toHuman() ?? '';
  return (
    <>
      <SidePanel
        header={message.isMutating ? 'Dry-run result' : 'Returned value'}
        emptyView="No results yet."
      >
        <div className="text-xs p-4">
          {
            <>
              {outcome && !error && <DryRunResult outcome={outcome} message={message} />}
              {decodedErr && <DryRunError debugMessage={debugMessage} error={decodedErr} />}
            </>
          }
        </div>
      </SidePanel>
      <SidePanel header="Transactions Log" emptyView="No transactions yet.">
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
