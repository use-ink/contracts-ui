// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { encodeTypeDef } from '@polkadot/types';
import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import { SidePanel } from '../common/SidePanel';
import { CopyButton } from '../common/CopyButton';
import { TransactionResult } from './TransactionResult';
import { isBn, fromSats } from 'helpers';
import { CallResult, Registry } from 'types';
import { useApi } from 'ui/contexts';

interface Props {
  results: CallResult[];
  registry: Registry;
  message: AbiMessage;
  outcome?: ContractCallOutcome;
}

export const ResultsOutput = ({ registry, results, outcome, message }: Props) => {
  const { api, tokenSymbol } = useApi();
  const output = outcome?.output?.toHuman() ?? undefined;
  const rawOutput = outcome?.output;
  const error = outcome?.result.isErr && outcome?.result.asErr.asModule;
  const decodedErr = error && registry.findMetaError(error);
  const formattedBallance =
    !!message.returnType &&
    encodeTypeDef(registry, message.returnType) === 'u128' &&
    isBn(rawOutput)
      ? `${fromSats(api, rawOutput)} ${tokenSymbol}`
      : undefined;

  return (
    <>
      <SidePanel
        header={message.isMutating ? 'Dry-run result' : 'Return value'}
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
              !decodedErr && (
                <>
                  {typeof output !== 'undefined' && output !== 'Ok' && (
                    <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600">
                      {formattedBallance ?? output.toLocaleString()}
                      <CopyButton
                        className="float-right"
                        value={formattedBallance ?? output?.toLocaleString() ?? ''}
                      />
                    </div>
                  )}
                  {message.isMutating && (
                    <>
                      <div className="mb-1">GasRequired</div>
                      <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600 mb-2">
                        {outcome?.gasRequired.toHuman()}
                        <CopyButton
                          className="float-right"
                          value={outcome?.gasRequired.toString() ?? ''}
                        />
                      </div>
                      <div className="mb-1">StorageDeposit</div>
                      <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600">
                        <>
                          {outcome?.storageDeposit.asCharge.toHuman()}
                          <CopyButton
                            className="float-right"
                            value={outcome?.storageDeposit.asCharge.toString() ?? ''}
                          />
                        </>
                      </div>
                    </>
                  )}
                </>
              )
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
