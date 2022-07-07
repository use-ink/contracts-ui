// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types';
import React, { useCallback } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/outline';
import { Button, Buttons } from '../common';
import { FormField } from './FormField';
import { TypeDef, ArgComponentProps, OrFalsy } from 'types';
import { getInitValue } from 'ui/util';
import { useApi } from 'ui/contexts';

interface Props extends ArgComponentProps<unknown[]> {
  component: React.ComponentType<ArgComponentProps<unknown>>;
}

export function Vector({
  component: Component,
  nestingNumber,
  onChange: _onChange,
  registry,
  typeDef,
  value = [],
}: Props) {
  const { keyring } = useApi();
  const subType = typeDef.sub as TypeDef;

  const onAddRow = useCallback((): void => {
    _onChange([...value, getInitValue(registry, keyring, subType)]);
  }, [_onChange, value, keyring, registry, subType]);

  const onRemoveRow = useCallback(() => _onChange(value.slice(0, -1)), [_onChange, value]);

  const onChange = useCallback(
    (index: number) =>
      (newValue: OrFalsy<unknown>): void => {
        _onChange(value.map((argAtIndex, atIndex) => (atIndex === index ? newValue : argAtIndex)));
      },
    [_onChange, value]
  );

  return (
    <div>
      <div className={'flex justify-start'}>
        <label className="arg-label flex-1 font-bold dark:text-white text-gray-600">
          {`Vec<${encodeTypeDef(registry, subType)}>`}
        </label>
        <Buttons>
          <Button
            className="px-2 dark:text-white"
            onClick={onAddRow}
            variant="default"
            data-cy={`vector-add-${nestingNumber}`}
          >
            <PlusIcon className="dark:text-white h-3 w-3" />
          </Button>
          <Button
            className="px-2 dark:text-white"
            onClick={onRemoveRow}
            variant="default"
            data-cy={`vector-remove-${nestingNumber}`}
          >
            <MinusIcon className="dark:text-white h-3 w-3" />
          </Button>
        </Buttons>
      </div>
      {(value || []).map((element, index) => {
        return (
          <FormField
            key={`Vector-${index}`}
            label={`${index}`}
            className={`vector-field-${nestingNumber}`}
          >
            <Component
              nestingNumber={nestingNumber + 1}
              onChange={onChange(index)}
              registry={registry}
              typeDef={subType}
              value={element}
            />
          </FormField>
        );
      })}
    </div>
  );
}
