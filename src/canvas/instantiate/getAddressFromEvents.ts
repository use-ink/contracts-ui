import type { ApiPromise, EventRecord } from '../../types';

export const getAddressFromEvents = (api: ApiPromise | null, events: EventRecord[]) => {
  let address: string | undefined;
  events
    .filter(({ event }) => api?.events.contracts.Instantiated.is(event))
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
  return address;
};
