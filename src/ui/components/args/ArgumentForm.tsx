import React from 'react';
import { ArgSignature } from '../ArgSignature';
import { Form, FormField } from '../FormField';
import { findComponent } from './findComponent';
import type { AbiParam, SetState } from 'types';

interface Props {
  args: AbiParam[];
  argValues: Record<string, unknown>;
  setArgValues: SetState<Record<string, unknown>>;
}

export function ArgumentForm ({ args, argValues, setArgValues }: Props) {
  return (
    <Form>
      {args.map((arg) => {
        const Component = findComponent(arg.type);

        const onChange = (value: unknown) => {
          setArgValues(
            (prev) => ({
              ...prev,
              [arg.name]: value
            })
          );
        };
        
        return (
          <FormField
            className="ml-6 mt-2 mb-4"
            key={`${arg.name}`}
            label={
              <ArgSignature arg={arg} className="dark:text-gray-300" />
            }
          >
            <Component
              className="w-full dark:bg-gray-900 dark:text-gray-300 bg-white dark:border-gray-700 border-gray-200 rounded"
              id={arg.name}
              value={argValues[arg.name]}
              onChange={onChange}
            />
          </FormField>
        );
      })}
    </Form>
  );
};
