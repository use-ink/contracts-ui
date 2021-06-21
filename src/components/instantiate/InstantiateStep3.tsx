import React, { useState, useEffect } from 'react';
import ArgumentForm from '../ArgumentForm';
import useDropdown from '../useDropdown';
import { AbiMessage, InstantiateAction } from '../../types';
import { createOptions, createEmptyValues } from '../../canvas';

interface Props {
  constructors?: Partial<AbiMessage>[];
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep: number;
}
const Step3 = ({ constructors, dispatch, currentStep }: Props) => {
  const [constr, ConstructorDropdown, setConstructor] = useDropdown();
  const [argValues, setArgValues] = useState<Record<string, string>>();
  function handleArgValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    argValues && setArgValues({ ...argValues, [e.target.name]: e.target.value.trim() });
  }
  useEffect(() => {
    constructors && setConstructor(createOptions(constructors, 'message')[0]);
  }, [constructors]);

  useEffect(() => {
    constr && constructors && setArgValues(createEmptyValues(constructors[0].args));
  }, [constr]);

  if (currentStep !== 3) return null;

  return constructors ? (
    <>
      <ConstructorDropdown
        options={createOptions(constructors, 'message')}
        placeholder="no constructors found"
        className="mb-4"
      />
      {constr && (
        <>
          <ArgumentForm
            key={`args-${constr.name}`}
            message={typeof constr.value === 'number' ? constructors[constr.value] : undefined}
            handleChange={handleArgValueChange}
            argValues={argValues}
          />
          <button
            type="button"
            className="bg-gray-500 mr-4  text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              dispatch({
                type: 'GO_TO',
                payload: { step: 2 },
              })
            }
          >
            Back
          </button>
          <button
            type="button"
            className="bg-gray-500  text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </>
      )}
    </>
  ) : null;
};
export default Step3;
