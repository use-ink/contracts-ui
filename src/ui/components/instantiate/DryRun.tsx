// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { formatBalance } from '@polkadot/util';
import { createType } from '@polkadot/types';
import { SidePanel } from '../common/SidePanel';
import { Account } from '../account/Account';
import { useApi, useInstantiate } from 'ui/contexts';
import { fromSats } from 'api';
import { classes } from 'ui/util';

export function DryRun() {
  const { api } = useApi();
  const { dryRunResult } = useInstantiate();

  return (
    <SidePanel className="instantiate-outcome" header="Predicted Outcome">
      <div className="body">
        <div className="row">
          <div>
            Gas Required:
          </div>
          <div>
            {dryRunResult?.gasRequired && (
              <>{formatBalance(dryRunResult.gasRequired)}</>
            )}
          </div>
        </div>
        <div className="row">
          <div>
            Gas Consumed:
          </div>
          <div>
            {dryRunResult?.gasConsumed && (
              <>{formatBalance(dryRunResult.gasConsumed)}</>
            )}
          </div>
        </div>
        <div className="row">
          <div>
            Storage Deposit:
          </div>
          <div>
            {dryRunResult?.storageDeposit && (
              <>
                {dryRunResult.storageDeposit.isCharge
                  ? `Charge - ${formatBalance(createType(api.registry, 'Balance', fromSats(api, dryRunResult.storageDeposit.asCharge)))}`
                  : `Refund - ${formatBalance(createType(api.registry, 'Balance', fromSats(api, dryRunResult.storageDeposit.asRefund)))}`
                }
              </>
            )}
          </div>
        </div>
        <div className="row">
          <div>
            Contract Address:
          </div>
          <div>
            {dryRunResult?.result.isOk
              ? (
                <Account size={26} value={dryRunResult?.result.asOk.accountId.toString()} />
              )
              : 'None'
            }
          </div>
        </div>
        <div className="row">
          <span className={classes('validation', dryRunResult?.result.isOk ? 'success' : 'error')}>
            {
              dryRunResult?.result.isOk
                ? 'The instantiation will be successful.'
                : 'The instantiation will fail.'
            }
          </span>
        </div>
        {dryRunResult?.result.isErr && dryRunResult?.result.asErr.isModule && (
          <div className="font-monospace p-2 text-xs text-center rounded dark:text-red-400 dark:bg-red-800">
            {api.registry.findMetaError(dryRunResult?.result.asErr.asModule).name}
          </div>
        )}
      </div>
    </SidePanel>
  );
}
