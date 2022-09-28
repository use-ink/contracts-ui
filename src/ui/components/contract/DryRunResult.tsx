// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import { CopyButton } from '../common/CopyButton';
import { DryRunError } from './DryRunError';
import { useDecodedOutput } from 'ui/hooks';
import { classes, decodeStorageDeposit } from 'helpers';
import { useApi } from 'ui/contexts';

interface Props {
  outcome: ContractCallOutcome;
  message: AbiMessage;
}

export function DryRunResult({
  outcome: { output, gasRequired, storageDeposit, debugMessage, result },
  message,
}: Props) {
  const { api } = useApi();
  const { decodedOutput, isError } = useDecodedOutput(output, message.returnType);
  const { storageDepositValue, storageDepositType } = decodeStorageDeposit(storageDeposit);
  const error = result.isErr ? api.registry.findMetaError(result.asErr.asModule) : undefined;

  return (
    <div data-cy={`dryRun-${message.method}`}>
      <>
        <div
          className={classes(
            result.isErr || isError ? 'text-red-500' : 'text-green-500',
            'font-mono mb-2 text-sm'
          )}
        >{`${
          result.isErr
            ? 'Panic!'
            : isError
            ? 'Contract Reverted!'
            : message.isMutating || message.isPayable
            ? 'Contract call will be successful!'
            : ''
        }`}</div>
        {error && <DryRunError error={error} />}

        {!debugMessage.isEmpty && (
          <>
            {' '}
            <div className="mb-1">Debug message</div>
            <div
              className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-xs return-value dark:text-gray-400 text-gray-600 mb-2 break-all"
              data-cy="output"
            >
              {JSON.stringify(debugMessage.trim())}
              <CopyButton className="float-right" value={JSON.stringify(debugMessage.toHuman())} />
            </div>
          </>
        )}
        {decodedOutput !== 'Ok' && decodedOutput.trim() !== '' && (
          <>
            <div className="mb-1">Return value</div>
            <div
              className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600 mb-2 break-all"
              data-cy="output"
            >
              {decodedOutput}

              <CopyButton className="float-right" value={output?.toString() ?? ''} />
            </div>
          </>
        )}
        {(message.isMutating || message.isPayable) && (
          <>
            <div className="mb-1">GasRequired</div>
            <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600 mb-2">
              {gasRequired.toHuman()}
              <CopyButton className="float-right" value={gasRequired.toString() ?? ''} />
            </div>
            <div className="mb-1">{`StorageDeposit`}</div>
            <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600">
              <>
                {storageDepositType}: {storageDepositValue?.toHuman() ?? 'none'}
                <CopyButton className="float-right" value={storageDepositValue?.toString() ?? ''} />
              </>
            </div>
          </>
        )}
      </>
    </div>
  );
}
