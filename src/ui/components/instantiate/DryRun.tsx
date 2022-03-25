// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { formatBalance, formatNumber } from '@polkadot/util';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import { SidePanel } from '../common/SidePanel';
import { Account } from '../account/Account';
import { useApi, useInstantiate } from 'ui/contexts';

export function DryRun() {
  const { t } = useTranslation();
  const { api } = useApi();
  const { dryRunResult } = useInstantiate();

  const dryRunError =
    dryRunResult?.result.isErr && dryRunResult?.result.asErr.isModule
      ? api.registry.findMetaError(dryRunResult?.result.asErr.asModule)
      : null;

  return (
    <SidePanel className="instantiate-outcome" header="Predicted Outcome">
      <div className="body">
        <div className="row">
          <div>{t('gasRequired', 'Gas Required')}:</div>
          <div>{dryRunResult?.gasRequired && <>{formatNumber(dryRunResult.gasRequired)}</>}</div>
        </div>
        <div className="row">
          <div>{t('gasConsumed', 'Gas Consumed')}:</div>
          <div>{dryRunResult?.gasConsumed && <>{formatNumber(dryRunResult.gasConsumed)}</>}</div>
        </div>
        <div className="row">
          <div>{t('storageDeposit', 'Storage Deposit')}:</div>
          <div>
            {dryRunResult?.storageDeposit &&
              (() => {
                if (dryRunResult.storageDeposit.isCharge) {
                  if (dryRunResult.storageDeposit.asCharge.eqn(0)) {
                    return 'None';
                  }

                  return formatBalance(dryRunResult.storageDeposit.asCharge, { decimals: 12 });
                }

                return 'None';
              })()}
          </div>
        </div>
        <div className="row h-8">
          <div>{t('contractAddress', 'Contract Address')}:</div>
          <div>
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
              {t('instantiateDryRunSuccess', 'The instantiation will be successful.')}
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
