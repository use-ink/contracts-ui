// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { assert } from '@polkadot/util';
import { AddressSelect } from '../account/Select';
import { Input } from './Input';
import { InputBalance } from './InputBalance';
import { InputNumber } from './InputNumber';
import { Vector } from './Vector';
import { Bool } from './Bool';
import { Enum } from './Enum';
import { Option } from './Option';
import { VectorFixed } from './VectorFixed';
import { Struct } from './Struct';
import { SubForm } from './SubForm';
import { Tuple } from './Tuple';
import { ArgComponentProps, Registry, TypeDef, TypeDefInfo } from 'types';

function subComponents(
  registry: Registry,
  typeDef: TypeDef,
  nestingNumber: number
): React.ComponentType<ArgComponentProps<unknown>>[] {
  assert(!!typeDef.sub, 'Cannot retrieve subComponent array for type definition');

  return (Array.isArray(typeDef.sub) ? typeDef.sub : [typeDef.sub]).map(subTypeDef =>
    findComponent(registry, subTypeDef, nestingNumber)
  );
}

// nestingNumber counts the depth of nested components
export function findComponent(
  registry: Registry,
  type: TypeDef,
  nestingNumber = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): React.ComponentType<ArgComponentProps<any>> {
  if (type.info === TypeDefInfo.Compact) {
    return findComponent(registry, type.sub as TypeDef);
  }

  if (type.info === TypeDefInfo.Enum) {
    const components = subComponents(registry, type, nestingNumber);

    return (props: React.PropsWithChildren<ArgComponentProps<Record<string, unknown>>>) => (
      <Enum components={components} {...props} typeDef={type} />
    );
  }

  if (type.info === TypeDefInfo.Option) {
    const [component] = subComponents(registry, type, nestingNumber);

    return (props: React.PropsWithChildren<ArgComponentProps<unknown>>) => {
      return <Option component={component} {...props} typeDef={type} />;
    };
  }

  if (type.info === TypeDefInfo.Si) {
    return findComponent(registry, registry.lookup.getTypeDef(type.type), nestingNumber);
  }

  if (type.info === TypeDefInfo.Struct) {
    const components = subComponents(registry, type, nestingNumber + 1);

    return (props: ArgComponentProps<Record<string, unknown>>) => {
      return (
        <SubForm nestingNumber={nestingNumber}>
          <Struct components={components} {...props} />
        </SubForm>
      );
    };
  }

  if (type.info === TypeDefInfo.Tuple) {
    const components = subComponents(registry, type, nestingNumber + 1);

    return (props: ArgComponentProps<unknown[]>) => {
      return (
        <SubForm nestingNumber={nestingNumber}>
          <Tuple components={components} {...props} />
        </SubForm>
      );
    };
  }

  if (type.info === TypeDefInfo.Vec) {
    const [component] = subComponents(registry, type, nestingNumber + 1);

    return (props: ArgComponentProps<unknown[]>) => {
      return (
        <SubForm nestingNumber={nestingNumber}>
          <Vector component={component} {...props} />
        </SubForm>
      );
    };
  }

  if (type.info === TypeDefInfo.VecFixed) {
    const [component] = subComponents(registry, type, nestingNumber + 1);

    return (props: React.PropsWithChildren<ArgComponentProps<unknown[]>>) => (
      <SubForm nestingNumber={nestingNumber}>
        <VectorFixed component={component} {...props} />
      </SubForm>
    );
  }

  switch (type.type) {
    case 'AccountId':
    case 'Address':
      return AddressSelect;

    case 'Balance':
      return InputBalance;

    case 'bool':
      return Bool;

    case 'u8':
    case 'i8':
    case 'i32':
    case 'u32':
    case 'i64':
    case 'i128':
    case 'u64':
    case 'u128':
    case 'BN':
      return InputNumber;

    default:
      return Input;
  }
}
