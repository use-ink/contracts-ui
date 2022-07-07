// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';
import { isNumber } from '@polkadot/util';
import { Dropdown } from '../common/Dropdown';
import { ArgSignature } from '../message/ArgSignature';
import { FormField, getValidation } from './FormField';
import { ArgComponentProps, OrFalsy, TypeDef } from 'types';
import { useApi } from 'ui/contexts';
import { getInitValue } from 'ui/util';

interface Props extends ArgComponentProps<Record<string, unknown>> {
  components: React.ComponentType<ArgComponentProps<unknown>>[];
}

export function Enum(props: Props) {
  const { components, typeDef, nestingNumber, onChange: _onChange, registry, value = {} } = props;
  const variants = typeDef.sub as TypeDef[];
  const { keyring } = useApi();
  const [variantIndex, _setVariantIndex] = useState<number>(
    Math.max(
      0,
      variants.findIndex(({ name }) => name === Object.keys(value)[0])
    )
  );

  const Component = components[variantIndex];

  const onChange = useCallback(
    (value: unknown): void => {
      _onChange({ [variants[variantIndex].name as string]: value });
    },
    [_onChange, variants, variantIndex]
  );

  const setVariantIndex = useCallback(
    (value: OrFalsy<number>) => {
      if (isNumber(value)) {
        _setVariantIndex(value);

        _onChange({
          [variants[value].name as string]: getInitValue(registry, keyring, variants[value]),
        });
      }
    },
    [registry, keyring, _onChange, variants]
  );

  return (
    <>
      <Dropdown
        options={variants.map(({ name }, index) => ({ label: name, value: index }))}
        value={variantIndex}
        onChange={setVariantIndex}
      />
      {variants[variantIndex].type !== 'Null' && (
        <FormField
          className={`ml-8 mt-2 enum-field-${nestingNumber}`}
          label={<ArgSignature arg={{ type: variants[variantIndex] }} registry={registry} />}
          {...getValidation(props)}
        >
          <Component
            nestingNumber={nestingNumber + 1}
            value={Object.values(value)[0]}
            onChange={onChange}
            registry={registry}
            typeDef={variants[variantIndex]}
          />
        </FormField>
      )}
    </>
  );
}
