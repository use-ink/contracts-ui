// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TypeDef } from '@polkadot/types/types';
import React from 'react';

export type SubComponent = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
  name: string;
};

type Props = {
  components: Array<SubComponent>;
  props: {
    className: string;
    value: Record<string, unknown>;
    id: string;
    onChange: (value: Record<string, unknown>) => void;
    nestingNumber: number;
    type: TypeDef;
  };
};

export function SubForm({ components, props: { value, onChange, nestingNumber }, props }: Props) {
  const _onChange = (name: string) => (newEntry: unknown) => {
    const newValue = Object.assign(value, { [name]: newEntry });
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
          <div key={`div-${row}`} className={'mb-4 mr-1'}>
            <Component
              key={`component-${row}`}
              {...props}
              value={value ? value[name] : ''}
              onChange={_onChange(name)}
            />
          </div>
        ))}
    </div>
  );
}
