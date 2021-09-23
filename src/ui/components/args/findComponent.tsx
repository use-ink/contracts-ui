import { Input } from '../Input';
import { Bool } from './inputs/Bool';
import type { TypeDef } from 'types';
import { InputBalance } from '../InputBalance';
import { InputNumber } from '../InputNumber';

export function findComponent (type: TypeDef): React.ComponentType<any> {
  switch (type.type) {
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