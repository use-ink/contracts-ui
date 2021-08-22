import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { randomAsHex } from '@polkadot/util-crypto';
import { ArgumentForm } from '../ArgumentForm';
import { Dropdown } from '../Dropdown';
import { InstantiateCodeAction, DropdownOption, AbiMessage } from '../../../types';
import { InputDropdown } from '../InputDropdown';
import { Input } from '../Input';
import { createOptions, createEmptyValues, unitOptions } from 'canvas/util';

interface Props {
  constructors?: Partial<AbiMessage>[];
  dispatch: React.Dispatch<InstantiateCodeAction>;
  currentStep: number;
}

export const CodeStep2 = ({ constructors, dispatch, currentStep }: Props) => {
  const [constr, setConstructor] = useState<DropdownOption>();
  const [argValues, setArgValues] = useState<Record<string, string>>();
  const [endowment, setEndowment] = useState(0);
  const [salt, setSalt] = useState(randomAsHex());
  const [isSaltEnabled, setIsSaltEnabled] = useState(false);
  const [maxGas, setMaxGas] = useState<number>(0);

  useEffect(() => {
    constructors && setConstructor(createOptions(constructors, 'message')[0]);
  }, [constructors]);

  useEffect(() => {
    constructors && setArgValues(createEmptyValues(constructors[0].args));
  }, [constr]);

  useEffect(() => {
    // TODO Gas and Endowment values should be retrieved differently.
    setMaxGas(155852802980);
    setEndowment(1300889614901161);
  }, [maxGas, endowment]);

  if (currentStep !== 2) return null;

  return constructors ? (
    <>
      <label htmlFor="constr" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Deployment constructor
      </label>
      <Dropdown
        options={createOptions(constructors, 'message')}
        placeholder="no constructors found"
        className="mb-4"
        selectedOption={constr}
        changeHandler={(o: DropdownOption) => setConstructor(o)}
      />
      {constr && (
        <>
          <ArgumentForm
            key={`args-${constr.name}`}
            args={typeof constr.value === 'number' ? constructors[constr.value].args : undefined}
            handleChange={e =>
              setArgValues({ ...argValues, [e.target.name]: e.target.value.trim() })
            }
            argValues={argValues}
          />

          <div className="my-6">
            <label
              htmlFor="endowment"
              className="block text-sm mb-2 font-medium dark:text-gray-300 text-gray-700"
            >
              Endowment
            </label>
            <InputDropdown
              inputValue={endowment}
              handleSelectChange={(): void => undefined} // TODO
              handleInputChange={e => {
                setEndowment(Number(e.target.value));
              }}
              selectOptions={unitOptions()}
            />
          </div>

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

          <div className="my-6">
            <label
              htmlFor="max_gas"
              className="block text-sm my-2 font-medium dark:text-gray-300 text-gray-700"
            >
              Max Gas Allowed
            </label>
            <Input
              value={maxGas}
              handleChange={e => setMaxGas(Number(e.target.value))}
              placeholder="1,000"
            />
          </div>

          <button
            type="button"
            className="text-xs bg-indigo-500 hover:bg-indigo-600 mr-4 text-gray-100 font-bold py-2 px-4 rounded mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!constr.name || !argValues}
            onClick={() =>
              argValues &&
              dispatch({
                type: 'STEP_2_COMPLETE',
                payload: {
                  constructorName: constr.name,
                  argValues,
                  endowment: endowment,
                  salt: salt,
                  gas: maxGas,
                },
              })
            }
          >
            Next
          </button>
          <button
            type="button"
            className="text-xs hover:underline text-gray-100 font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              dispatch({
                type: 'GO_TO',
                payload: { step: 1 },
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
