// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Balance } from '@polkadot/types/interfaces';
import { ContractCallOutcome } from '@polkadot/api-contract/types';

type UIStorageDeposit = {
  storageDepositValue: Balance | undefined;
  storageDepositType: 'charge' | 'refund' | 'empty';
};

export function decodeStorageDeposit(
  storageDeposit: ContractCallOutcome['storageDeposit']
): UIStorageDeposit {
  const x = {} as UIStorageDeposit;
  if (storageDeposit.isCharge) {
    x.storageDepositValue = storageDeposit.asCharge;
    x.storageDepositType = 'charge';
  } else if (storageDeposit.isRefund) {
    x.storageDepositValue = storageDeposit.asRefund;
    x.storageDepositType = 'refund';
  } else {
    x.storageDepositType = 'empty';
  }

  return x;
}
