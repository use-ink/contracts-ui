import React, { useState, useEffect } from 'react';
import { ArgumentForm } from '../ArgumentForm';
import { Dropdown } from '../Dropdown';
import { createOptions, createEmptyValues } from 'canvas/util';
import type { InstantiateAction, DropdownOption, AbiMessage } from 'types';

interface Props {
  constructors?: Partial<AbiMessage>[];
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep: number;
}
export const Step3 = ({ constructors, dispatch, currentStep }: Props) => {
  const [constr, setConstructor] = useState<DropdownOption>();
  const [argValues, setArgValues] = useState<Record<string, string>>();

  useEffect(() => {
    constructors && setConstructor(createOptions(constructors, 'message')[0]);
  }, [constructors]);

  useEffect(() => {
    constructors && setArgValues(createEmptyValues(constructors[0].args));
  }, [constr]);

  if (currentStep !== 3) return null;

  return constructors ? (
    <>
      <label htmlFor="constr" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Deployment constructor
      </label>
      <Dropdown
        options={createOptions(constructors, 'message')}
        placeholder="no constructors found"
        className="mb-4"
        value={constr}
        onChange={(o) => setConstructor(o)}
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

          <button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-600 mr-4 text-gray-100 font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!constr.name || !argValues}
            onClick={() =>
              argValues &&
              dispatch({
                type: 'STEP_3_COMPLETE',
                payload: {
                  constructorName: constr.name,
                  argValues,
                },
              })
            }
          >
            Next
          </button>
          <button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-600 text-gray-100 font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              dispatch({
                type: 'GO_TO',
                payload: { step: 2 },
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
