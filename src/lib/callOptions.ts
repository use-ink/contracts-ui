// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BN_ZERO } from './bn';
import { AbiParam, BN, ContractCallOutcome, Registry, UIStorageDeposit, WeightV2 } from 'types';

export function decodeStorageDeposit(
  storageDeposit: ContractCallOutcome['storageDeposit'],
): UIStorageDeposit {
  if (storageDeposit.isCharge) {
    return { value: storageDeposit.asCharge, type: 'charge' };
  } else if (storageDeposit.isRefund) {
    return { value: storageDeposit.asRefund, type: 'refund' };
  }
  return {
    type: 'empty',
  };
}

export function getPredictedCharge(dryRun: UIStorageDeposit) {
  return dryRun.type === 'charge'
    ? !dryRun.value?.eq(BN_ZERO)
      ? (dryRun.value ?? null)
      : null
    : null;
}

export function getStorageDepositLimit(
  switchOn: boolean,
  userInput: BN,
  registry: Registry,
  dryRunValue?: UIStorageDeposit,
) {
  return switchOn
    ? registry.createType('Balance', userInput)
    : dryRunValue
      ? getPredictedCharge(dryRunValue)
      : null;
}

export function getGasLimit(
  switchOn: boolean,
  refTimeLimit: BN,
  proofSizeLimit: BN,
  registry: Registry,
): WeightV2 | null {
  return switchOn
    ? registry.createType('WeightV2', {
        refTime: refTimeLimit,
        proofSize: proofSizeLimit,
      })
    : null;
}

export function transformUserInput(
  registry: Registry,
  messageArgs: AbiParam[],
  values?: Record<string, unknown>,
): unknown[] {
  return messageArgs.map(({ name, type: { type } }) => {
    const value = values ? values[name] : null;

    if (type === 'Balance') {
      return registry.createType('Balance', value);
    }
    if (type === 'U256') {
      return registry.createType('U256', value);
    }

    return value;
  });
}
