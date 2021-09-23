import React from 'react';
import type { AbiParam } from 'types';
import { findComponent } from './findComponent';

interface Props {
  args: AbiParam[];
  argValues: Record<string, unknown>;
  setArgValues: (_: Record<string, unknown>) => void;
}

export const ArgumentForm = ({ args, argValues, setArgValues }: Props) => {
  return (
    <>
      {args.map(({ name, type }) => {
        const Component = findComponent(type);

        function onChange (value: unknown) {
          setArgValues({
            ...argValues,
            [name]: value
          });
        }

        return (
          <div className="ml-6 mt-2 mb-4" key={`${name}`}>
            <Component
              className="w-full text-xs dark:bg-gray-900 dark:text-gray-300 bg-white dark:border-gray-700 border-gray-200 rounded"
              id={name}
              value={argValues[name]}
              onChange={onChange}
            />
          </div>
        );
      })}
    </>
  );
};
