// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountSelect } from '../account/AccountSelect';
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
      return AccountSelect;

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
