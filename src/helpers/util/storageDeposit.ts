// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Balance } from '@polkadot/types/interfaces';
import { ContractCallOutcome } from '@polkadot/api-contract/types';

type UIStorageDeposit = {
  storageDepositValue?: Balance;
  storageDepositType: 'charge' | 'refund' | 'empty';
};

export function decodeStorageDeposit(
  storageDeposit: ContractCallOutcome['storageDeposit']
): UIStorageDeposit {
  if (storageDeposit.isCharge) {
    return { storageDepositValue: storageDeposit.asCharge, storageDepositType: 'charge' };
  } else if (storageDeposit.isRefund) {
    return { storageDepositValue: storageDeposit.asRefund, storageDepositType: 'refund' };
  }
  return {
    storageDepositType: 'empty',
  };
}
