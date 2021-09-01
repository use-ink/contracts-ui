import React, { useState, useEffect } from 'react';
import { ArgumentForm } from '../ArgumentForm';
import { Dropdown } from '../Dropdown';
import { createOptions, createEmptyValues } from 'canvas/util';
import type { InstantiateAction, DropdownOption, AbiMessage } from 'types';
import { Button } from '../Button';
import { Buttons } from '../Buttons';

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
    constructors &&
      setArgValues(createEmptyValues(constructors[(constr?.value as number) || 0].args));
  }, [constr]);

  if (currentStep !== 3) return null;

  return constructors ? (
    <>
      <label htmlFor="constr" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Deployment constructor
      </label>
      <Dropdown
        options={createOptions(constructors, 'message')}
        className="mb-4"
        value={constr}
        onChange={(o) => setConstructor(o)}
      >
        No constructors found
      </Dropdown>
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
          <Buttons>
            <Button
              className="mr-4"
              isDisabled={!constr.name || !argValues}
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
      )}
    </>
  ) : null;
};
