// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { TypeDef, ArgComponentProps } from 'types';

export type SubComponent = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
  name: string;
};

type Props = ArgComponentProps<Record<string, unknown>> & {
  components: Array<SubComponent>;
  nestingNumber: number;
  type: TypeDef;
};

export function SubForm({ components, value, onChange, nestingNumber, type, ...props }: Props) {
  const _onChange = (name: string) => (newEntry: unknown) => {
    const newValue = { ...value, [name]: newEntry };
    onChange(newValue);
  };
  const isOddNesting = nestingNumber % 2 != 0;
  return (
    <div
      className={`p-4 text-left text-sm ${
        isOddNesting ? 'dark:bg-gray-900 bg-white' : 'dark:bg-elevation-1 bg-gray-100'
      } rounded border dark:border-gray-500 border-gray-200`}
    >
      {components &&
        components.map(({ Component, name }, row) => (
          <>
            <label
              className="block mb-1.5 text-sm font-semibold dark:text-white text-gray-600"
              key={`${type.name}-label-${row}`}
              htmlFor={name}
            >
              {name}
            </label>
            <div key={`${type.name}-component-${row}`} className={'mb-4 mr-1'}>
              <Component {...props} value={value ? value[name] : ''} onChange={_onChange(name)} />
            </div>
          </>
        ))}
    </div>
  );
}
