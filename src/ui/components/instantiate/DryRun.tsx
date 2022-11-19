// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { SidePanel } from '../common/SidePanel';
import { Account } from '../account/Account';
import { OutcomeItem } from '../contract/OutcomeItem';
import { useApi, useInstantiate } from 'ui/contexts';

export function DryRun() {
  const {
    dryRunResult,
    data: { constructorIndex },
  } = useInstantiate();
  const { api } = useApi();
  const dryRunError =
    dryRunResult?.result.isErr && dryRunResult?.result.asErr.isModule
      ? api.registry.findMetaError(dryRunResult?.result.asErr.asModule)
      : null;

  return (
    <SidePanel className="instantiate-outcome" header="Dry-run outcome">
      <div className="body" data-cy="dry-run-result">
        <div>
          <div data-cy="estimated-gas">
            {dryRunResult?.gasConsumed && (
              <>
                <span>GasConsumed</span>
                <div className="flex">
                  <div className="basis-1/2 pr-2">
                    <OutcomeItem
                      title=""
                      displayValue={`refTime: ${dryRunResult.gasConsumed.refTime.toString()}`}
                      key={`gcr-${constructorIndex}`}
                    />
                  </div>
                  <div className="basis-1/2 pl-2">
                    <OutcomeItem
                      title=""
                      displayValue={`proofSize: ${dryRunResult.gasConsumed.proofSize.toString()}`}
                      key={`gcp-${constructorIndex}`}
                    />
                  </div>
                </div>
              </>
            )}
            {dryRunResult?.gasRequired && (
              <>
                <span>GasRequired</span>
                <div className="flex">
                  <div className="basis-1/2 pr-2">
                    <OutcomeItem
                      title=""
                      displayValue={`refTime: ${dryRunResult.gasRequired.refTime.toString()}`}
                      key={`grr-${constructorIndex}`}
                    />
                  </div>
                  <div className="basis-1/2 pl-2">
                    <OutcomeItem
                      title=""
                      displayValue={`proofSize: ${dryRunResult.gasRequired.proofSize.toString()}`}
                      key={`grp-${constructorIndex}`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="row">
          <div>Storage Deposit:</div>
          <div data-cy="estimated-storage-deposit">
            {dryRunResult?.storageDeposit &&
              (() => {
                if (dryRunResult.storageDeposit.isCharge) {
                  if (dryRunResult.storageDeposit.asCharge.eqn(0)) {
                    return 'None';
                  }

                  return dryRunResult.storageDeposit.asCharge.toHuman();
                }

                return 'None';
              })()}
          </div>
        </div>
        <div className="row h-8">
          <div>Contract Address:</div>
          <div data-cy="dry-run-account">
            {dryRunResult?.result.isOk ? (
              <Account size={26} value={dryRunResult?.result.asOk.accountId.toString()} />
            ) : (
              'None'
            )}
          </div>
        </div>
        <div>
          {dryRunResult?.result.isOk && (
            <div className="validation success font-bold">
              <CheckCircleIcon className="mr-3" />
              The instantiation will be successful.
            </div>
          )}
          {dryRunError && dryRunResult && (
            <>
              <div className="validation error text-mono font-bold items-start">
                <ExclamationCircleIcon className="mr-3" style={{ marginTop: 1 }} />
                <div>
                  <p>{dryRunError.name}</p>
                  <p>{dryRunError.docs}</p>
                </div>
              </div>
              {dryRunResult.debugMessage.length > 0 && (
                <div className="validation error block text-mono break-words pl-4 mt-1">
                  {dryRunResult.debugMessage.toString()}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </SidePanel>
  );
}
