// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import type { AbiConstructor } from '@polkadot/api-contract/types';
import { Button, Buttons } from '../common/Button';
import { Form, FormField, getValidation } from '../form/FormField';
import { InputNumber } from '../form/InputNumber';
import { InputBalance } from '../form/InputBalance';
import { InputSalt } from '../form/InputSalt';
import { ArgumentForm } from 'ui/components/form/ArgumentForm';
import { Dropdown } from 'ui/components/common/Dropdown';
import { createConstructorOptions } from 'api/util';
import { useInstantiate } from 'ui/contexts';

export function Step2() {
  const state = useInstantiate();

  const {
    argValues: [argValues, setArgValues],
    constructorIndex,
    deployConstructor,
    endowment,
    isUsingSalt: [isUsingSalt, toggleIsUsingSalt],
    metadata,
    onFinalize,
    salt,
    step: [, , stepBack],
    weight: { executionTime, isValid: isWeightValid, megaGas, setMegaGas, percentage },
  } = state;

  return (
    <>
      <Form>
        <FormField
          id="constructor"
          label="Deployment Constructor"
          {...getValidation(constructorIndex)}
        >
          <Dropdown
            id="constructor"
            options={createConstructorOptions(metadata.value?.constructors as AbiConstructor[])}
            className="mb-4"
            {...constructorIndex}
          >
            No constructors found
          </Dropdown>
          {deployConstructor && argValues && (
            <ArgumentForm
              key={`args-${deployConstructor?.method}`}
              args={deployConstructor.args}
              setArgValues={setArgValues}
              argValues={argValues}
            />
          )}
        </FormField>
        <FormField id="endowment" label="Endowment" {...getValidation(endowment)}>
          <InputBalance id="endowment" {...endowment} />
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
            !endowment.isValid ||
            (isUsingSalt && !salt.isValid) ||
            !isWeightValid ||
            !deployConstructor?.method ||
            !argValues
          }
          onClick={onFinalize}
          variant="primary"
        >
          Next
        </Button>

        <Button onClick={stepBack} variant="default">
          Go Back
        </Button>
      </Buttons>
    </>
  );
}
