// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Button, Buttons } from '../common';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
  props: { className: string; value: unknown[]; id: string; onChange: (value: unknown[]) => void };
};

export function Vector({ Component, props: { value, onChange }, props }: Props) {
  const _rowAdd = () => onChange([...value, '']);
  const _rowRemove = () => onChange(value.slice(0, -1));
  const _onChange = (row: number) => (newEntry: unknown) => {
    const newValue = value.map((entry, index) => (index == row ? newEntry : entry));
    onChange(newValue);
  };
  return (
    <>
      <Buttons className={'mt-2 mb-4 justify-end'}>
        <Button onClick={_rowAdd}>Add</Button>
        <Button isDisabled={value && value.length === 0} onClick={_rowRemove}>
          Remove
        </Button>
      </Buttons>
      {value &&
        value.map((entry, row) => (
          <div key={`div-${row}`} className={'mb-4'}>
            <Component
              key={`component-${row}`}
              {...props}
              value={entry}
              onChange={_onChange(row)}
            />
          </div>
        ))}
    </>
  );
}
