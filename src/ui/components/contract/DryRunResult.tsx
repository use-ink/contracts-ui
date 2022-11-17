// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AbiMessage } from '@polkadot/api-contract/types';
import { DryRunError } from './DryRunError';
import { OutcomeItem } from './OutcomeItem';
import { useDecodedOutput } from 'ui/hooks';
import { classes, decodeStorageDeposit } from 'helpers';
import { ContractExecResult, Registry } from 'types';
import { useApi } from 'ui/contexts';

interface Props {
  outcome: ContractExecResult;
  message: AbiMessage;
  registry: Registry;
}

export function DryRunResult({
  outcome: { gasRequired, gasConsumed, storageDeposit, debugMessage, result },
  message,
  registry,
}: Props) {
  const { decodedOutput, isError } = useDecodedOutput(result, message, registry);
  const { api } = useApi();
  const { storageDepositValue, storageDepositType } = decodeStorageDeposit(storageDeposit);
  const isDispatchable = message.isMutating || message.isPayable;

  const dispatchError =
    result.isErr && result.asErr.isModule
      ? api.registry.findMetaError(result.asErr.asModule)
      : undefined;

  const shouldDisplayRequired = !gasConsumed.refTime.toBn().eq(gasRequired.refTime.toBn());
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
        {dispatchError && <DryRunError error={dispatchError} />}

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
            // copyValue={decodedOutput.toString() ?? ''}
            key={`err-${message.method}`}
          />
        )}
        {isDispatchable && (
          <>
            <OutcomeItem
              title="GasConsumed"
              displayValue={gasConsumed.refTime.toString()}
              key={`gc-${message.method}`}
            />
            {shouldDisplayRequired && (
              <OutcomeItem
                title="GasRequired"
                displayValue={gasRequired.refTime.toString()}
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
