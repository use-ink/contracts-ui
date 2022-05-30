// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { OrFalsy, Registry, SimpleSpread, TypeDef, ValidFormField } from 'types';

type Props = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  ValidFormField<unknown[]>
> & {
  component: React.ComponentType<ValidFormField<unknown> & React.HTMLAttributes<unknown>>;
  registry: Registry;
  typeDef: TypeDef;
};

export function VecFixed({ component: Component, onChange: _onChange, typeDef, value }: Props) {
  const length = typeDef.length as number;

  const onChange = useCallback(
    (index: number) =>
      (newValue: OrFalsy<unknown>): void => {
        _onChange(value.map((argAtIndex, atIndex) => (atIndex === index ? newValue : argAtIndex)));
      },
    [_onChange, value]
  );

  return (
    <div className="flex items-start">
      {[...Array(length).keys()].map((_, index) => {
        return (
          <Component key={`VecFixed-${index}`} onChange={onChange(index)} value={value[index]} />
        );
      })}
    </div>
  );
}
