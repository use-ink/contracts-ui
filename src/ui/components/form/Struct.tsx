// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types';
import { FormField } from './FormField';
import { TypeDef, ArgComponentProps } from 'types';

type Props = ArgComponentProps<Record<string, unknown>> & {
  components: React.ComponentType<ArgComponentProps<unknown>>[];
};

export function Struct({ components, value, nestingNumber, onChange, registry, typeDef }: Props) {
  const _onChange = (name: string) => (newEntry: unknown) => {
    const newValue = { ...value, [name]: newEntry };
    onChange(newValue);
  };

  return (
    <div>
      {typeDef?.sub &&
        components &&
        components.map((Component, index) => {
          const subType = (typeDef.sub as TypeDef[])[index];
          const name = subType.displayName || subType.name || '';

          return (
            <FormField
              key={`${typeDef.name}-label-${index}`}
              label={`${name}: ${subType.typeName || encodeTypeDef(registry, subType)}`}
              className={name}
            >
              <Component
                value={value ? value[name] : ''}
                nestingNumber={nestingNumber + 1}
                onChange={_onChange(name)}
                registry={registry}
                typeDef={subType}
              />
            </FormField>
          );
        })}
    </div>
  );
}
