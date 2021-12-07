// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { Button, Buttons } from '../common/Button';
import { Form, FormField } from '../form/FormField';
import { InputGas } from '../form/InputGas';
import { InputBalance } from '../form/InputBalance';
import { ArgumentForm } from 'ui/components/form/ArgumentForm';
import { Dropdown } from 'ui/components/common/Dropdown';
import { createConstructorOptions } from 'api/util';
import { useInstantiate } from 'ui/contexts';
import { useBalance } from 'ui/hooks/useBalance';
import { useArgValues } from 'ui/hooks/useArgValues';
import { useWeight } from 'ui/hooks/useWeight';

import type { AbiMessage } from 'types';

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

  const weight = useWeight();

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

  const submitHandler = () => {
    onFinalize &&
      onFinalize({
        constructorIndex,
        endowment,
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
            !endowmentValidation.isValid ||
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
