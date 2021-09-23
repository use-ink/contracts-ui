import React from 'react';
import type { AbiConstructor } from '@polkadot/api-contract/types';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { FormField } from '../FormField';
import { InputNumber } from '../InputNumber';
// import { InputBalance } from '../InputBalance';
import { InputBalance } from '../InputBalance';
import { InputSalt } from './InputSalt';
import { ArgumentForm } from 'ui/components/args/ArgumentForm';
import { Dropdown } from 'ui/components/Dropdown';
import { createConstructorOptions } from 'canvas/util';
import { useInstantiate } from 'ui/contexts';
// import { isNumber } from '@polkadot/util';

export function Step2 () {
  const {
    argValues: [argValues, setArgValues],
    constructorIndex,
    deployConstructor,
    endowment,
    isUsingSalt: [isUsingSalt],
    metadata,
    salt,
    step: [, stepForward, stepBack],
    weight: {
      executionTime,
      isValid: isWeightValid,
      megaGas, 
      setMegaGas,
      percentage
    },
  } = useInstantiate();

  return (
    <>
      <FormField
        id="constructor"
        label="Deployment Constructor"
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
      <FormField
        id="endowment"
        label="Endowment"
      >
        <InputBalance
          id="endowment"
          {...endowment}
        />
      </FormField>
      <FormField
        id="salt"
        label="Deployment Salt"
      >
        <InputSalt />
      </FormField>
      <FormField
        id="maxGas"
        label="Max Gas Allowed"
      >
        <InputNumber
          value={megaGas}
          onChange={setMegaGas}
          placeholder="200000"
        />
        <div className="relative">
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
      <Buttons>
        <Button
          isDisabled={!endowment.isValid || (isUsingSalt && !salt.isValid) || !isWeightValid || !deployConstructor?.method || !argValues}
          onClick={stepForward}
          variant='primary'
        >
          Next
        </Button>

        <Button
          onClick={stepBack}
          variant='default'
        >
          Go Back
        </Button>
      </Buttons>
    </>
  );
};
