import React from 'react';
import { CallResult } from 'types';

interface Props {
  result: CallResult;
  date: string;
}
export const QueryResult = ({ result: { time, data, method, returnType, error }, date }: Props) => {
  return (
    <div
      key={`${time}`}
      className="text-xs text-gray-400 break-all p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="mb-2">{date}</div>
      <div className="flex items-center">
        <div className="text-mono flex-1 leading-relaxed" style={{ wordBreak: 'break-word' }}>
          <span className="text-yellow-300">{method}</span>
          <span className="mr-2">{`(): ${returnType}`}</span>
        </div>
        <div className="bg-elevation-1 p-2 flex-1 rounded-sm text-mono">{`${data}`}</div>
        {error && (
          <div className="bg-elevation-1 p-2 flex-1 rounded-sm text-mono">
            {error.docs.map((doc, index) => (
              <p key={index}>{doc}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
