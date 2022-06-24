// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useMemo } from 'react';
import { ArgSignature } from '../message/ArgSignature';
import { Form, FormField } from './FormField';
import { findComponent } from './findComponent';
import { AbiParam, Registry, SetState } from 'types';
import { classes } from 'ui/util';

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  args: AbiParam[];
  argValues: Record<string, unknown>;
  registry: Registry;
  setArgValues: SetState<Record<string, unknown>>;
}

export function ArgumentForm({ args, argValues, registry, setArgValues, className }: Props) {
  const components = useMemo(
    () => args.map(arg => ({ arg, Component: findComponent(registry, arg.type) })),
    [args, registry]
  );
  return (
    <Form className="argument-form">
      {components.map(({ arg, Component }) => {
        const onChange = (value: unknown) => {
          setArgValues(prev => ({
            ...prev,
            [arg.name]: value,
          }));
        };

        return (
          <FormField
            className={classes(className, arg.name, 'ml-6 mt-2 mb-4')}
            key={`${arg.name}`}
            label={
              <ArgSignature
                arg={arg}
                className="dark:text-gray-300 text-gray-600"
                registry={registry}
              />
            }
          >
            <Component
              className="w-full dark:bg-gray-900 dark:text-gray-300 text-gray-600 bg-white dark:border-gray-700 border-gray-200 rounded"
              id={arg.name}
              value={argValues[arg.name]}
              nestingNumber={0}
              onChange={onChange}
              registry={registry}
              typeDef={arg.type}
            />
          </FormField>
        );
      })}
    </Form>
  );
}
