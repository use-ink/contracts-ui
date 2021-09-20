import React, { useEffect, useMemo } from 'react';
import { Switch } from '@headlessui/react';
import BN from 'bn.js';
import type { AbiConstructor } from '@polkadot/api-contract/types';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { ArgumentForm } from 'ui/components/ArgumentForm';
import { Dropdown } from 'ui/components/Dropdown';
import { InputDropdown } from 'ui/components/InputDropdown';
import { Input } from 'ui/components/Input';
import { createConstructorOptions, createEmptyValues, unitOptions } from 'canvas/util';
import { useInstantiate } from 'ui/contexts';

export function Step2 () {
  const {
    argValues: [argValues, setArgValues],
    constructorIndex: [constructorIndex, setConstructorIndex],
    endowment: [endowment, setEndowment, isEndowmentValid],
    isUsingSalt: [isUsingSalt, toggleIsUsingSalt],
    metadata,
    salt: [salt, setSalt],
    step: [step, setStep],
    weight: {
      executionTime,
      isValid: isWeightValid,
      megaGas, 
      setMegaGas,
      percentage
    },
  } = useInstantiate();

  const constructor = useMemo(
    (): AbiConstructor | undefined => metadata.value?.constructors[constructorIndex],
    [metadata.value, constructorIndex]
  );

  useEffect(
    (): void => {
      setArgValues(createEmptyValues(constructor?.args))
    },
    [constructor?.args, metadata.value?.constructors]
  )

  return (
    <>
      <label htmlFor="constructor" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Deployment constructor
      </label>
      <Dropdown
        options={createConstructorOptions(metadata.value?.constructors as AbiConstructor[])}
        className="mb-4"
        value={constructorIndex}
        onChange={setConstructorIndex}
      >
        No constructors found
      </Dropdown>

      {constructor && (
        <>
          {/* TODO Create dynamic params: bool, vector... */}
          <ArgumentForm
            key={`args-${constructor.method}`}
            args={metadata.value?.constructors[constructorIndex].args}
            onChange={e =>
              setArgValues({ ...argValues, [e.target.name]: e.target.value.trim() })
            }
            argValues={argValues}
          />

          {/* Endowment */}
          <div className="my-6">
            <label
              htmlFor="endowment"
              className="block text-sm mb-2 font-medium dark:text-gray-300 text-gray-700"
            >
              Endowment
            </label>
            <InputDropdown
              inputValue={endowment.toString()}
              handleSelectChange={(): void => undefined}
              handleInputChange={e => {
                setEndowment(new BN(e.target.value));
              }}
              selectOptions={unitOptions()}
            />
          </div>

          {/* Deployment Salt */}
          <div className="flex items-center my-6">
            <div className="flex-1">
              <label
                htmlFor="salt"
                className="block text-sm mb-2 font-medium dark:text-gray-300 text-gray-700"
              >
                Deployment Salt
              </label>
              <Input
                value={salt || ''}
                onChange={setSalt}
                placeholder="0x"
                isDisabled={!isUsingSalt}
              />
            </div>
            <div className="ml-4 mt-6">
              <Switch
                checked={isUsingSalt}
                onChange={toggleIsUsingSalt}
                className={`${isUsingSalt ? 'bg-indigo-500' : 'bg-gray-700'}
          relative inline-flex flex-shrink-0 w-16 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${isUsingSalt ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
            </div>
          </div>

          {/* Max Gas Allowed */}
          <div className="my-6">
            <label
              htmlFor="max_gas"
              className="block text-sm my-2 font-medium dark:text-gray-300 text-gray-700"
            >
              Max Gas Allowed
            </label>
            <Input
              value={megaGas.toString()}
              onChange={(value) => setMegaGas(new BN(value))}
              placeholder="1,000"
            />
          </div>
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
          <Buttons>
            <Button
              isDisabled={!isEndowmentValid || !isWeightValid || !constructor.method || !argValues}
              onClick={() => {
                setStep(step + 1)
              }}
              variant='primary'
            >
              Next
            </Button>

            <Button
              onClick={() => setStep(step - 1)}
              variant='default'
            >
              Go Back
            </Button>
          </Buttons>
        </>
      )}
    </>
  );
};
