// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import { DryRunError } from './DryRunError';
import { OutcomeItem } from './OutcomeItem';
import { useDecodedOutput } from 'ui/hooks';
import { classes, decodeStorageDeposit, genRanHex } from 'helpers';
import { useApi } from 'ui/contexts';

interface Props {
  outcome: ContractCallOutcome;
  message: AbiMessage;
}

export function DryRunResult({
  outcome: { output, gasRequired, gasConsumed, storageDeposit, debugMessage, result },
  message,
}: Props) {
  const { api } = useApi();
  const { decodedOutput, isError } = useDecodedOutput(output);
  const { storageDepositValue, storageDepositType } = decodeStorageDeposit(storageDeposit);
  const isDispatchable = message.isMutating || message.isPayable;

  const dispatchError =
    result.isErr && result.asErr.isModule
      ? api.registry.findMetaError(result.asErr.asModule)
      : undefined;

  const shouldDisplayRequired = !gasConsumed.eq(gasRequired);
  const prediction = result.isErr
    ? 'Contract Reverted!'
    : isError
    ? 'Contract Reverted!'
    : isDispatchable
    ? 'Contract call will be successful!'
    : '';

  return (
    <div
      data-cy={`dryRun-${message.method}`}
      className="flex-col flex"
      key={`dryRun-${message.method}`}
    >
      <>
        {isDispatchable && (
          <div
            className={classes(
              result.isErr || isError ? 'text-red-500' : 'text-green-500',
              'font-mono mb-2 text-sm'
            )}
          >
            {prediction}
          </div>
        )}
        {dispatchError && <DryRunError error={dispatchError} key={genRanHex(8)} />}

        {!debugMessage.isEmpty && (
          <OutcomeItem
            title="Debug message"
            displayValue={debugMessage.toHuman()}
            key={`debug-${message.method}`}
          />
        )}
        {!dispatchError && (
          <OutcomeItem
            title={isDispatchable ? 'Execution result' : 'Return value'}
            displayValue={decodedOutput}
            copyValue={output?.toString() ?? ''}
            key={`err-${message.method}`}
          />
        )}
        {isDispatchable && (
          <>
            <OutcomeItem
              title="GasConsumed"
              displayValue={gasConsumed.toHuman()}
              key={`gc-${message.method}`}
            />
            {shouldDisplayRequired && (
              <OutcomeItem
                title="GasRequired"
                displayValue={gasRequired.toHuman()}
                key={`gr-${message.method}`}
              />
            )}
            <OutcomeItem
              title="StorageDeposit"
              displayValue={`${storageDepositType}: ${storageDepositValue?.toHuman() ?? 'none'}`}
              copyValue={storageDepositValue?.toString() ?? ''}
              key={`sd-${message.method}`}
            />
          </>
        )}
      </>
    </div>
  );
}
