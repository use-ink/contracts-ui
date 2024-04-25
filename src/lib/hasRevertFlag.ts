// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ContractInstantiateResult } from 'types';

export function hasRevertFlag(dryRunResult: ContractInstantiateResult | undefined) {
  return dryRunResult?.result.isOk ? dryRunResult.result.asOk.result.flags.isRevert : false;
}
