// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { isHex } from '@polkadot/util';
import { randomAsHex } from '@polkadot/util-crypto';
import { Button, Buttons } from '../common/Button';
import { Form, FormField, getValidation } from '../form/FormField';
import { InputNumber } from '../form/InputNumber';
import { InputBalance } from '../form/InputBalance';
import { InputSalt } from '../form/InputSalt';
import { ArgumentForm } from 'ui/components/form/ArgumentForm';
import { Dropdown } from 'ui/components/common/Dropdown';
import { createConstructorOptions } from 'api/util';
import { useInstantiate } from 'ui/contexts';
import { useBalance } from 'ui/hooks/useBalance';
import { useArgValues } from 'ui/hooks/useArgValues';
import { useFormField } from 'ui/hooks/useFormField';
import { useWeight } from 'ui/hooks/useWeight';
import { useToggle } from 'ui/hooks/useToggle';

import { AbiMessage } from 'types';

export function Step2() {
  const {
    data: { metadata },
    stepBackward,
    currentStep,
    onFinalize,
  } = useInstantiate();

  const {
    value: endowment,
    onChange: onChangeEndowment,
    ...endowmentValidation
  } = useBalance(10000);

  const {
    executionTime,
    isValid: isWeightValid,
    megaGas,
    setMegaGas,
    percentage,
    weight,
  } = useWeight();

  const salt = useFormField<string>(randomAsHex(), value => {
    if (!!value && isHex(value) && value.length === 66) {
      return { isValid: true };
    }

    return { isValid: false, isError: true, message: 'Invalid hex string' };
  });

  const [constructorIndex, setConstructorIndex] = useState<number>(0);
  const [deployConstructor, setDeployConstructor] = useState<AbiMessage>();

  const [argValues, setArgValues, setArgs] = useArgValues([]);

  useEffect(() => {
    setConstructorIndex(0);
    metadata && setDeployConstructor(metadata.constructors[0]);
  }, [metadata, setConstructorIndex]);

  useEffect(() => {
    deployConstructor && setArgs(deployConstructor.args);
  }, [deployConstructor, setArgs]);

  const [isUsingSalt, toggleIsUsingSalt] = useToggle(true);

  const submitHandler = () => {
    onFinalize &&
      onFinalize({
        constructorIndex,
        salt: isUsingSalt ? salt.value : undefined,
        endowment,
        argValues,
        weight,
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
              setConstructorIndex(v);
              setDeployConstructor(metadata.constructors[v]);
              setArgs(metadata.constructors[v].args);
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
        <FormField id="endowment" label="Endowment" {...endowmentValidation}>
          <InputBalance id="endowment" value={endowment} onChange={onChangeEndowment} />
        </FormField>
        <FormField id="salt" label="Deployment Salt" {...getValidation(salt)}>
          <InputSalt isActive={isUsingSalt} toggleIsActive={toggleIsUsingSalt} {...salt} />
        </FormField>
        <FormField
          id="maxGas"
          label="Max Gas Allowed"
          isError={!isWeightValid}
          message={!isWeightValid ? 'Invalid gas limit' : null}
        >
          <InputNumber value={megaGas} onChange={setMegaGas} placeholder="200000" />
          <div className="relative pt-2">
            <p className="text-gray-500 text-xs pb-2">
              {executionTime < 0.001 ? '<0.001' : executionTime.toFixed(3)}s execution time (
              {percentage}% of block time)
            </p>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
              <div
                style={{ width: `${percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-400"
              ></div>
            </div>
          </div>
        </FormField>
      </Form>
      <Buttons>
        <Button
          isDisabled={
            !endowmentValidation.isValid ||
            (isUsingSalt && !salt.isValid) ||
            !isWeightValid ||
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
