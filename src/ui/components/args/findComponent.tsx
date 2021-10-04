import { Input } from '../Input';
import { InputBalance } from '../InputBalance';
import { InputNumber } from '../InputNumber';
import { AccountSelect } from '../AccountSelect';
import { Bool } from './inputs/Bool';
import type { TypeDef } from 'types';

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
