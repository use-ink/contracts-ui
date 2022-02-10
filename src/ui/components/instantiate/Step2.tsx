// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { isHex, isNumber } from '@polkadot/util';
import { randomAsHex } from '@polkadot/util-crypto';
import { Button, Buttons } from '../common/Button';
import { Form, FormField, getValidation } from '../form/FormField';
import { InputBalance } from '../form/InputBalance';
import { InputSalt } from '../form/InputSalt';
import { InputGas } from '../form/InputGas';
import { ArgumentForm } from 'ui/components/form/ArgumentForm';
import { Dropdown } from 'ui/components/common/Dropdown';
import { createConstructorOptions } from 'ui/util/dropdown';
import { useInstantiate } from 'ui/contexts';
import { useBalance } from 'ui/hooks/useBalance';
import { useArgValues } from 'ui/hooks/useArgValues';
import { useFormField } from 'ui/hooks/useFormField';
import { useWeight } from 'ui/hooks/useWeight';
import { useToggle } from 'ui/hooks/useToggle';

import type { AbiMessage } from 'types';

export function Step2() {
  const {
    data: { metadata },
    stepBackward,
    currentStep,
    onFinalize,
  } = useInstantiate();

  const { value, onChange: onChangeValue, ...valueValidation } = useBalance(10000);

  const weight = useWeight();

  const salt = useFormField<string>(randomAsHex(), value => {
    if (!!value && isHex(value) && value.length === 66) {
      return { isValid: true };
    }

    return { isValid: false, isError: true, message: 'Invalid hex string' };
  });

  const [constructorIndex, setConstructorIndex] = useState<number>(0);
  const [deployConstructor, setDeployConstructor] = useState<AbiMessage>();

  const [argValues, setArgValues] = useArgValues(deployConstructor?.args || []);

  useEffect(() => {
    setConstructorIndex(0);
    metadata && setDeployConstructor(metadata.constructors[0]);
  }, [metadata, setConstructorIndex]);

  const [isUsingSalt, toggleIsUsingSalt] = useToggle(true);

  const submitHandler = () => {
    onFinalize &&
      onFinalize({
        constructorIndex,
        salt: isUsingSalt ? salt.value : undefined,
        value,
        argValues,
        weight: weight.weight,
      });
  };

  if (currentStep !== 2) return null;

  return metadata ? (
    <>
      <Form>
        <FormField id="constructor" label="Deployment Constructor">
          <Dropdown
            id="constructor"
            options={createConstructorOptions(metadata.constructors)}
            className="mb-4"
            value={constructorIndex}
            onChange={v => {
              if (isNumber(v)) {
                setConstructorIndex(v);
                setDeployConstructor(metadata.constructors[v]);
              }
            }}
          >
            No constructors found
          </Dropdown>
          {deployConstructor && argValues && (
            <ArgumentForm
              key={`args-${deployConstructor.method}`}
              args={deployConstructor.args}
              setArgValues={setArgValues}
              argValues={argValues}
            />
          )}
        </FormField>
        {deployConstructor?.isPayable && (
          <FormField id="value" label="Value" {...valueValidation}>
            <InputBalance id="value" value={value} onChange={onChangeValue} />
          </FormField>
        )}
        <FormField id="salt" label="Deployment Salt" {...getValidation(salt)}>
          <InputSalt isActive={isUsingSalt} toggleIsActive={toggleIsUsingSalt} {...salt} />
        </FormField>
        <FormField
          id="maxGas"
          label="Max Gas Allowed"
          isError={!weight.isValid}
          message={!weight.isValid ? 'Invalid gas limit' : null}
        >
          <InputGas isCall {...weight} />
        </FormField>
      </Form>
      <Buttons>
        <Button
          isDisabled={
            (deployConstructor?.isPayable && !valueValidation.isValid) ||
            (isUsingSalt && !salt.isValid) ||
            !weight.isValid ||
            !deployConstructor?.method ||
            !argValues
          }
          onClick={submitHandler}
          variant="primary"
        >
          Next
        </Button>

        <Button onClick={stepBackward} variant="default">
          Go Back
        </Button>
      </Buttons>
    </>
  ) : null;
}
