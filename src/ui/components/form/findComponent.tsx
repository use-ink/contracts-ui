// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AddressSelect } from '../account/Select';
import { Input } from './Input';
import { InputBalance } from './InputBalance';
import { InputNumber } from './InputNumber';
import { Bool } from './Bool';
import type { TypeDef } from 'types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findComponent(type: TypeDef): React.ComponentType<any> {
  switch (type.type) {
    case 'AccountId':
    case 'Address':
      return AddressSelect;

    case 'Balance':
      return InputBalance;

    case 'bool':
      return Bool;

    case 'i32':
      return InputNumber;

    default:
      return Input;
  }
}
