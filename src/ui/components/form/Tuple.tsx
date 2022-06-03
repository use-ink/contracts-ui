// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types';
import { useCallback } from 'react';
import { FormField } from './FormField';
import { ArgComponentProps, OrFalsy, TypeDef } from 'types';

interface Props extends ArgComponentProps<unknown[]> {
  components: React.ComponentType<ArgComponentProps<unknown>>[];
};

export function Tuple({ components, nestingNumber, onChange: _onChange, registry, typeDef, value }: Props) {
  const onChange = useCallback(
    (index: number) =>
      (newValue: OrFalsy<unknown>): void => {
        _onChange(value.map((argAtIndex, atIndex) => (atIndex === index ? newValue : argAtIndex)));
      },
    [_onChange, value]
  );

  return (
    <div className="flex-1">
      {components.map((Component, index) => {
        if (value && value[index]) {
          const subType = (typeDef.sub as TypeDef[])[index]

          return (
            <FormField key={`Tuple-${index}`} label={`${index}: ${encodeTypeDef(registry, subType)}`}>
              <Component
                onChange={onChange(index)}
                nestingNumber={nestingNumber + 1}
                registry={registry}
                typeDef={subType}
                value={value[index]}
              />
            </FormField>
          );
        }

        return null;
      })}
    </div>
  );
}
