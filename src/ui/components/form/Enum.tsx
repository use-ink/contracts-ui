// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';
import { isNumber } from '@polkadot/util';
import { Dropdown } from '../common/Dropdown';
import { ArgSignature } from '../message/ArgSignature';
import { FormField, getValidation } from './FormField';
import { ArgComponentProps, OrFalsy, Registry, TypeDef } from 'types';
import { useApi } from 'ui/contexts';
import { getInitValue } from 'ui/util';

type Props = ArgComponentProps<Record<string, unknown>> & {
  components: React.ComponentType<ArgComponentProps<unknown>>[];
  registry: Registry;
  typeDef: TypeDef;
};

export function Enum(props: Props) {
  const { components, nestingNumber, typeDef, onChange: _onChange, registry, value = {} } = props;
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
          className="ml-8 mt-2"
          label={<ArgSignature arg={{ type: variants[variantIndex] }} />}
          {...getValidation(props)}
        >
          <Component value={Object.values(value)[0]} onChange={onChange} registry={registry}  nestingNumber={nestingNumber + 1} typeDef={variants[variantIndex]} />
        </FormField>
      )}
    </>
  );
}
