import { Input } from '../Input';
import { Bool } from './inputs/Bool';
import type { TypeDef } from 'types';
import { InputBalance } from '../InputBalance';

export function findComponent (type: TypeDef): React.ComponentType<any> {
  switch (type.type) {
    case 'Balance':
      return InputBalance;

    case 'bool':
      return Bool;

    default:
      return Input;
  }
}