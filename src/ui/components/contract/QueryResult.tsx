import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageSignature } from '../MessageSignature';
import { CallResult } from 'types';

interface Props {
  result: CallResult;
  date: string;
}
export const QueryResult = ({
  result: { time, data, message, error },
  date,
}: Props) => {
  return (
    <div
      key={`${time}`}
      className="text-xs text-gray-400 break-all p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="mb-2">{date}</div>
      <div>
        <div className="mb-2">
          <MessageSignature
            message={message}
          />
        </div>
        <div className="bg-elevation-1 p-2 rounded-sm text-mono">{`${data}`}</div>
      </div>
      {error && (
        <ReactMarkdown
          // eslint-disable-next-line react/no-children-prop
          children={error.docs.join('\r\n')}
          remarkPlugins={[remarkGfm]}
          className="markdown mt-4"
        />
      )}
    </div>
  );
};
