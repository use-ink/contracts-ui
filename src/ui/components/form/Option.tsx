// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useEffect, useRef } from 'react';
import { Switch } from '../common/Switch';
import { Input } from './Input';
import { ArgComponentProps, OrFalsy, Registry, TypeDef } from 'types';
import { useApi } from 'ui/contexts';
import { getInitValue, NOOP } from 'helpers';
import { useToggle } from 'ui/hooks/useToggle';

interface Props extends ArgComponentProps<unknown> {
  component: React.ComponentType<ArgComponentProps<unknown>>;
  registry: Registry;
  typeDef: TypeDef;
}

export function Option({
  component: Component,
  onChange: _onChange,
  nestingNumber,
  registry,
  typeDef,
  value = null,
}: Props) {
  const { accounts } = useApi();
  const [isSupplied, toggleIsSupplied] = useToggle(value !== null);
  const isSuppliedRef = useRef(isSupplied);

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
    if (isSupplied && !isSuppliedRef.current && value === null && accounts) {
      onChange(getInitValue(registry, accounts, typeDef.sub as TypeDef));
      isSuppliedRef.current = true;
    } else if (!isSupplied && isSuppliedRef.current && value !== null) {
      onChange(null);
      isSuppliedRef.current = false;
    }
  }, [accounts, registry, onChange, value, isSupplied, typeDef.sub]);

  return (
    <div className="flex items-start" data-cy="option-field">
      {isSupplied ? (
        <div className="flex-1">
          <Component
            onChange={onChange}
            value={value}
            nestingNumber={nestingNumber + 1}
            registry={registry}
            typeDef={typeDef.sub as TypeDef}
          />
        </div>
      ) : (
        <div className="flex-1">
          <Input isDisabled onChange={NOOP} value="" placeholder="Do not supply" />
        </div>
      )}
      <div className="flex justify-center items-center w-18 my-2.5">
        <Switch value={isSupplied} onChange={toggleIsSupplied} />
      </div>
    </div>
  );
}
