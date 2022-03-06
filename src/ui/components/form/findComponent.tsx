// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { AddressSelect } from '../account/Select';
import { Input } from './Input';
import { InputBalance } from './InputBalance';
import { InputNumber } from './InputNumber';
import { Bool } from './Bool';
import { Enum } from './Enum';
import { ArgComponentProps, Registry, TypeDef, TypeDefInfo, ValidFormField } from 'types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findComponent(registry: Registry, type: TypeDef): React.ComponentType<ArgComponentProps<any>> {

  if (type.info === TypeDefInfo.Si) {
    return findComponent(registry, registry.lookup.getTypeDef(type.type));
  }

  if (type.info === TypeDefInfo.Enum) {
    return (props: React.PropsWithChildren<ValidFormField<Record<string, unknown>>>) => ((
      <Enum
        components={(type.sub as TypeDef[]).map((enumVariant) => findComponent(registry, enumVariant))}
        registry={registry}
        typeDef={type}
        {...props}
      />
    ));
  }

  switch (type.type) {
    case 'AccountId':
    case 'Address':
      return AddressSelect;

    case 'Balance':
      return InputBalance;

    case 'bool':
      return Bool;

    case 'i32':
    case 'BN':
      return InputNumber;

    default:
      return Input;
  }
}
