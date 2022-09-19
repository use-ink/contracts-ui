// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import { SidePanel } from '../common/SidePanel';
import { QueryResult } from './QueryResult';
import { TransactionResult } from './TransactionResult';
import { CallResult, Registry } from 'types';

interface Props {
  results: CallResult[];
  registry: Registry;
  message: AbiMessage;
  outcome?: ContractCallOutcome;
}

export const ResultsOutput = ({ registry, results, outcome, message }: Props) => {
  const output = outcome?.output?.toHuman() ?? undefined;
  const error = outcome?.result.isErr && outcome?.result.asErr.asModule;
  const decodedErr = error && registry.findMetaError(error);

  return (
    <>
      <SidePanel
        header={message.isMutating ? 'Dry-run result' : `${message.method}`}
        emptyView="No results yet."
      >
        <div className="text-xs p-4">
          <>
            {typeof output === 'object' ? (
              'Err' in output ? (
                output.Err
              ) : (
                <pre>{JSON.stringify(output, null, 2)}</pre>
              )
            ) : (
              <div>{`${output ?? 'None'}`}</div>
            )}
            {decodedErr && (
              <div>
                {decodedErr.name}
                <ReactMarkdown
                  // eslint-disable-next-line react/no-children-prop
                  children={decodedErr?.docs.join('\r\n')}
                  remarkPlugins={[remarkGfm]}
                  className="markdown mt-2"
                />
                {outcome?.debugMessage.toHuman()}
              </div>
            )}
          </>
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
