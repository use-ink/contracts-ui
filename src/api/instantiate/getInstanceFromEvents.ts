// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise, Abi, EventRecord } from 'types';

export const getInstanceFromEvents = (
  events: EventRecord[],
  api: ApiPromise,
  metadata: Abi
): ContractPromise | undefined => {
  let address;
  let contract: ContractPromise | undefined;
  events
    .filter(({ event }) => api.events.contracts.Instantiated.is(event))
    .map(
      ({
        event: {
          data: [, contract],
        },
      }) => {
        address = `${contract}`;
        console.log(`Instantiated: ${contract}`);
      }
    );
  if (address) {
    contract = new ContractPromise(api, metadata, address);
  }
  return contract;
};
