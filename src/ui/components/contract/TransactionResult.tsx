// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DecodedEvent } from '@polkadot/api-contract/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { CallResult, EventRecord, Registry } from 'types';

interface Props {
  result: CallResult;
  date: string;
  registry: Registry;
}
function Events({ events }: { events: EventRecord[] }) {
  return (
    <>
      <div className="text-sm mb-1">Generic events</div>
      {events.map(({ event }) =>
        event.method === 'ContractEmitted' ? null : (
          <div key={event.method} className="capitalize">{`${event.section}::${event.method}`}</div>
        )
      )}
    </>
  );
}
function ContractEvents({ contractEvents }: { contractEvents: DecodedEvent[] }) {
  return (
    <div className="mb-3">
      {contractEvents.map(({ event, args }) => {
        const a = args.map((a, i) => (
          <div key={`${event.identifier}-${event.args[i].name}`}>
            <div className="text-gray-200">{event.args[i].name}</div>
            {JSON.stringify(a.toHuman(), null, 2)}
          </div>
        ));
        return (
          <div key={event.identifier}>
            <div className="mb-2 text-sm">{event.identifier}</div>
            {a}
          </div>
        );
      })}
    </div>
  );
}

export const TransactionResult = ({
  result: { time, error, events, contractEvents },
  date,
}: Props) => {
  return (
    <div
      key={`${time}`}
      className="text-xs dark:text-gray-400 text-gray-600 break-all p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex-col">
        <div className="mb-2">{date}</div>
        <div className="flex-col items-start mb-2 mt-4">
          <div className="event-log">
            {contractEvents && <ContractEvents contractEvents={contractEvents} />}
            <Events events={events} />
          </div>
        </div>
        {error && (
          <>
            <span className="mb-2">{`${error.section}:${error.method}`}</span>
            <ReactMarkdown
              // eslint-disable-next-line react/no-children-prop
              children={error.docs.join('\r\n')}
              remarkPlugins={[remarkGfm]}
              className="markdown mt-2"
            />
          </>
        )}
      </div>
    </div>
  );
};
