import React, { useState, useEffect } from 'react';
import { AbiConstructor } from '@polkadot/api-contract/types';
import { ArgumentForm } from '../ArgumentForm';
import { Dropdown } from '../Dropdown';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { createEmptyValues } from 'canvas/util';
import type { InstantiateAction } from 'types';

interface Props {
  constructors: AbiConstructor[];
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep: number;
}
export const Step3 = ({ constructors, dispatch, currentStep }: Props) => {
  const constructorOptions = constructors.map((constructor) => ({
    name: constructor.method,
    value: constructor
  }));

  const [constructor, setConstructor] = useState<AbiConstructor>(constructors[0]);
  const [argValues, setArgValues] = useState<Record<string, string>>();

  useEffect(() => {
    constructor &&
      setArgValues(createEmptyValues(constructor?.args));
  }, [constructor]);

  if (currentStep !== 3) return null;

  return constructors ? (
    <>
      {constructor && (
        <>
      <label htmlFor="constr" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Deployment constructor
      </label>
      <Dropdown
        options={constructorOptions}
        className="mb-4"
        value={constructor}
        onChange={setConstructor}
      >
        No constructors found
      </Dropdown>
          <ArgumentForm
            key={`args-${constructor.method}`}
            args={constructor.args}
            handleChange={e =>
              setArgValues({ ...argValues, [e.target.name]: e.target.value.trim() })
            }
            argValues={argValues}
          />
        </>
      )}
        <Buttons>
          <Button
            className="mr-4"
            isDisabled={!constructor || !argValues}
            onClick={() =>
              argValues && constructor?.method &&
              dispatch({
                type: 'STEP_3_COMPLETE',
                payload: {
                  constructorName: constructor?.method,
                  argValues,
                },
              })
            }
            variant='primary'
          >
            Next
          </Button>
          <Button
            onClick={() =>
              dispatch({
                type: 'GO_TO',
                payload: { step: 2 },
              })
            }
          >
            Go Back
          </Button>
        </Buttons>
    </>
  ) : null;
};
