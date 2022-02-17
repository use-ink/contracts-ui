// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { formatBalance } from '@polkadot/util';
import { createType } from '@polkadot/types';
import { SidePanel } from '../common/SidePanel';
import { Account } from '../account/Account';
import { useApi, useInstantiate } from 'ui/contexts';
import { fromSats } from 'api';

export function DryRun() {
  const { api } = useApi();
  const { dryRunResult } = useInstantiate();

  return (
    <SidePanel header="Predicted Outcome">
      {dryRunResult?.result.isErr ? (
        <>
          <span className="validation error">Failure</span>
          {dryRunResult?.result.asErr.isModule &&
            api.registry.findMetaError(dryRunResult?.result.asErr.asModule).name}
        </>
      ) : (
        <>
          <span className="validation success">Success</span>
          <Account value={dryRunResult?.result.asOk.accountId.toString()} />
        </>
      )}
      {dryRunResult?.gasRequired && (
        <div>Gas Required: {formatBalance(dryRunResult.gasRequired)}</div>
      )}
      {dryRunResult?.gasConsumed && (
        <div>Gas Consumed: {formatBalance(dryRunResult.gasConsumed)}</div>
      )}
      {dryRunResult?.storageDeposit && (
        <div>
          {dryRunResult.storageDeposit.isCharge
            ? `Charge: ${formatBalance(
                createType(
                  api.registry,
                  'Balance',
                  fromSats(api, dryRunResult.storageDeposit.asCharge)
                )
              )}`
            : `Refund: ${formatBalance(fromSats(api, dryRunResult.storageDeposit.asRefund))}`}
        </div>
      )}
    </SidePanel>
  );
}
