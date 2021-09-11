import React from 'react';
import { CallResult } from 'types';

interface Props {
  results: CallResult[];
}
export const ResultsOutput = ({ results }: Props) => {
  return (
    <div className="mb-8 border rounded-t-md border-gray-200 dark:border-gray-700">
      <div className="text-sm rounded-t-md border-b text-gray-300 border-gray-200 dark:border-gray-700 bg-elevation-1 p-4">
        Call Results
      </div>
      <div className="p-4">
        {results.map(({ time, data }) => {
          return <div key={`${time}`} className="text-xs text-gray-300 break-all">{`${data}`}</div>;
        })}
      </div>
    </div>
  );
};
