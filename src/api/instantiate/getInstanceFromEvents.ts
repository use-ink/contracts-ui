// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, Abi, Contract, ContractPromise, EventRecord } from 'types';

export const getInstanceFromEvents = (
  events: EventRecord[],
  api: ApiPromise,
  metadata: Abi
): Contract | undefined => {
  let address;
  let contract: Contract | undefined;

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
