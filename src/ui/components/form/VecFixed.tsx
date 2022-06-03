// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types';
import { useCallback } from 'react';
import { FormField } from './FormField';
import { OrFalsy, Registry, SimpleSpread, TypeDef, ValidFormField } from 'types';
// import { useToggle } from 'ui/hooks/useToggle';

// const INTEGER_TYPES = [ 'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64', 'u128'];

type Props = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  ValidFormField<unknown[]>
> & {
  component: React.ComponentType<ValidFormField<unknown> & React.HTMLAttributes<unknown>>;
  registry: Registry;
  typeDef: TypeDef;
};

export function VecFixed({ component: Component, onChange: _onChange, registry, typeDef, value }: Props) {
  // const isEncodeable = INTEGER_TYPES.includes((typeDef.sub as TypeDef).type);
  // const [isUsingTextInput, setIsUsingTextInput] = useToggle(false);

  const length = typeDef.length as number;

  const onChange = useCallback(
    (index: number) =>
      (newValue: OrFalsy<unknown>): void => {
        _onChange(value.map((argAtIndex, atIndex) => (atIndex === index ? newValue : argAtIndex)));
      },
    [_onChange, value]
  );

  return (
    <div>
      {[...Array(length).keys()].map((_, index) => {
        return (
          <FormField key={`VecFixed-${index}`} label={`${index}: ${encodeTypeDef(registry, typeDef.sub as TypeDef)}`}>
            <Component onChange={onChange(index)} value={value[index]} />
          </FormField>
        );
      })}
    </div>
  );
}
