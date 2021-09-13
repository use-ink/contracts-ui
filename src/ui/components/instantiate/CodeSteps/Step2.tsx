import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { randomAsHex } from '@polkadot/util-crypto';
import { InstantiateAction, DropdownOption, Abi } from 'types';
import { ArgumentForm } from 'ui/components/ArgumentForm';
import { Dropdown } from 'ui/components/Dropdown';
import { InputDropdown } from 'ui/components/InputDropdown';
import { Input } from 'ui/components/Input';
import { createOptions, createEmptyValues, unitOptions } from 'canvas/util';
import { useWeight } from 'ui/hooks';

interface Props {
  metadata: Abi;
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep: number;
}

export const Step2 = ({ metadata, dispatch, currentStep }: Props) => {
  const [constructor, setConstructor] = useState<DropdownOption>();
  const [argValues, setArgValues] = useState<Record<string, string>>();
  const [endowment, setEndowment] = useState(1000);
  const [salt, setSalt] = useState(randomAsHex());
  const [isSaltEnabled, setIsSaltEnabled] = useState(false);
  const [maxGas, setMaxGas] = useState<number>(0);
  const { megaGas, percentage, executionTime } = useWeight();

  const abiConstructors = metadata?.constructors;

  useEffect(() => {
    abiConstructors && setConstructor(createOptions(abiConstructors, 'message')[0]);
  }, [abiConstructors]);

  useEffect(() => {
    abiConstructors && setArgValues(createEmptyValues(abiConstructors[0].args));
  }, [constructor]);

  if (currentStep !== 2) return null;

  return abiConstructors ? (
    <>
      <label htmlFor="constructor" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Deployment constructor
      </label>
      <Dropdown
        options={createOptions(abiConstructors, 'message')}
        placeholder="No constructors found"
        className="mb-4"
        selectedOption={constructor}
        changeHandler={(option: DropdownOption) => setConstructor(option)}
      />

      {constructor && (
        <>
          {/* TODO Create dynamic params: bool, vector... */}
          <ArgumentForm
            key={`args-${constructor.name}`}
            args={
              typeof constructor.value === 'number'
                ? abiConstructors[constructor.value].args
                : undefined
            }
            handleChange={e =>
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
              inputValue={endowment}
              handleSelectChange={(): void => undefined}
              handleInputChange={e => {
                setEndowment(Number(e.target.value));
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
                Deployemnt Salt
              </label>
              <Input
                value={isSaltEnabled ? salt : ''}
                handleChange={e => setSalt(e.target.value)}
                placeholder="0x"
                disabled={!isSaltEnabled}
              />
            </div>
            <div className="ml-4 mt-6">
              <Switch
                checked={isSaltEnabled}
                onChange={setIsSaltEnabled}
                className={`${isSaltEnabled ? 'bg-indigo-500' : 'bg-gray-700'}
          relative inline-flex flex-shrink-0 w-16 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${isSaltEnabled ? 'translate-x-9' : 'translate-x-0'}
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
              value={megaGas.toNumber()}
              handleChange={e => setMaxGas(Number(e.target.value))}
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

          <button
            type="button"
            className="btn-primary"
            disabled={!constructor.name || !argValues}
            onClick={() => {
              argValues &&
                dispatch({
                  type: 'DEPLOYMENT_INFO',
                  payload: {
                    constructorName: constructor.name,
                    constructorIndex: constructor.value as number,
                    argValues,
                    endowment: endowment,
                    salt: salt,
                    gas: maxGas != 0 ? maxGas : megaGas.toNumber(),
                  },
                });
            }}
          >
            Next
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              dispatch({
                type: 'GO_TO',
                payload: { step: currentStep - 1 },
              })
            }
          >
            Go Back
          </button>
        </>
      )}
    </>
  ) : null;
};
