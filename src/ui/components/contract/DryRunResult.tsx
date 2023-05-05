// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AbiMessage } from '@polkadot/api-contract/types';
import { DryRunError } from './DryRunError';
import { OutcomeItem } from './OutcomeItem';
import { classes, decodeStorageDeposit, getDecodedOutput } from 'helpers';
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
  const { decodedOutput, isError } = getDecodedOutput({ result, debugMessage }, message, registry);
  const { api } = useApi();
  const { value: storageDepositValue, type: storageDepositType } =
    decodeStorageDeposit(storageDeposit);
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
      className="flex flex-col"
      key={`dryRun-${message.method}`}
    >
      <>
        {isDispatchable && (
          <div
            className={classes(
              result.isErr || isError ? 'text-red-500' : 'text-green-500',
              'mb-2 font-mono text-sm'
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
            key={`err-${message.method}`}
          />
        )}
        {isDispatchable && (
          <div data-cy="dry-run-estimations">
            <span>GasConsumed</span>
            <div className="flex">
              <div className="basis-1/2 pr-2">
                <OutcomeItem
                  title=""
                  displayValue={`refTime: ${gasConsumed.refTime.toString()}`}
                  key={`gcr-${message.method}`}
                  id={`gcr-${message.method}`}
                />
              </div>
              <div className="basis-1/2 pl-2">
                <OutcomeItem
                  title=""
                  displayValue={`proofSize: ${gasConsumed.proofSize.toString()}`}
                  key={`gcp-${message.method}`}
                  id={`gcp-${message.method}`}
                />
              </div>
            </div>

            {shouldDisplayRequired && (
              <>
                <span>GasRequired</span>
                <div className="flex">
                  <div className="basis-1/2 pr-2">
                    <OutcomeItem
                      title=""
                      displayValue={`refTime: ${gasRequired.refTime.toString()}`}
                      key={`grr-${message.method}`}
                      id={`grr-${message.method}`}
                    />
                  </div>
                  <div className="basis-1/2 pl-2">
                    <OutcomeItem
                      title=""
                      displayValue={`proofSize: ${gasRequired.proofSize.toString()}`}
                      key={`grp-${message.method}`}
                      id={`grp-${message.method}`}
                    />
                  </div>
                </div>
              </>
            )}
            <OutcomeItem
              title="StorageDeposit"
              displayValue={`${storageDepositType}: ${storageDepositValue?.toHuman() ?? 'none'}`}
              copyValue={storageDepositValue?.toString() ?? ''}
              key={`sd-${message.method}`}
            />
          </div>
        )}
      </>
    </div>
  );
}
