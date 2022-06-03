// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useEffect } from 'react';
import { Switch } from '../common/Switch';
import { Input } from './Input';
import { OrFalsy, Registry, SimpleSpread, TypeDef, ValidFormField } from 'types';
import { useApi } from 'ui/contexts';
import { getInitValue } from 'ui/util';
import { useToggle } from 'ui/hooks/useToggle';
import { NOOP } from 'api';

interface Props extends ArgComponentProps<unknown> & {
  component: React.ComponentType<ValidFormField<unknown> & React.HTMLAttributes<unknown>>;
  registry: Registry;
  typeDef: TypeDef;
};

export function Option({
  component: Component,
  onChange: _onChange,
  registry,
  typeDef,
  value = null,
}: Props) {
  const { keyring } = useApi();

  const [isSupplied, toggleIsSupplied] = useToggle();
  const onChange = useCallback(
    (value: OrFalsy<unknown>): void => {
      if (!isSupplied) {
        _onChange(null);

        return;
      }

      _onChange(value);
    },
    [_onChange, isSupplied]
  );

  useEffect((): void => {
    if (isSupplied && value === null) {
      console.log('set initial value');
      onChange(getInitValue(registry, keyring, typeDef.sub as TypeDef));
    } else {
      if (!isSupplied && value !== null) {
        onChange(null);
      }
    }
  }, [keyring, registry, onChange, value, isSupplied, typeDef.sub]);

  return (
    <div className="flex items-start">
      {isSupplied ? (
        <Component className="flex-1" onChange={onChange} value={value} />
      ) : (
        <Input className="flex-1" isDisabled onChange={NOOP} value="" placeholder="Do not supply" />
      )}
      <div className="flex justify-center items-center w-18 my-2.5">
        <Switch value={isSupplied} onChange={toggleIsSupplied} />
      </div>
    </div>
  );
}
