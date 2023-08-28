// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ContractInstantiateResult } from 'types';

export function checkInstantiateReversion(dryRunResult: ContractInstantiateResult | undefined) {
  return dryRunResult?.result.isOk
    ? dryRunResult.result.asOk.result.flags.toHuman().includes('Revert')
    : false;
}
