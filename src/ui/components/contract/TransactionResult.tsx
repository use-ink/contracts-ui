// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { CallResult, Registry } from 'types';

interface Props {
  result: CallResult;
  date: string;
  registry: Registry;
}

export const TransactionResult = ({ result: { time, error, log }, date }: Props) => {
  return (
    <div
      key={`${time}`}
      className="text-xs dark:text-gray-400 text-gray-600 break-all p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex-col">
        <div className="mb-2">{date}</div>
        <div className="flex-col items-start mb-2 mt-4">
          <div className="event-log">{log}</div>
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
