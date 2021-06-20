import React, { useEffect } from 'react';
import { AbiMessage, InstantiateAction } from '../../types';
import { createEmptyValues, createOptions } from '../../canvas';
import useDropdown from '../useDropdown';
import useArgumentForm from '../ArgumentForm';

interface Props {
  constructors?: AbiMessage[];
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep: number;
}

const Step2 = ({ constructors, dispatch, currentStep }: Props) => {
  const [constr, ConstructorDropdown, setConstructor] = useDropdown();
  const [argValues, ArgumentForm, setArgValues] = useArgumentForm();

  useEffect(() => {
    constructors && setConstructor(createOptions(constructors, 'message')[0]);
  }, [constructors]);

  useEffect(() => {
    constr && constructors && setArgValues(createEmptyValues(constructors[0].args));
  }, [constr]);

  if (currentStep !== 2) return null;

  return constructors ? (
    <div className="w-full max-w-xl mt-8">
      <ConstructorDropdown
        options={constructors && createOptions(constructors, 'message')}
        placeholder="no constructors found"
        className="mb-4"
      />
      {constr && (
        <>
          <ArgumentForm
            key={`args-${constr.name}`}
            message={typeof constr.value === 'number' ? constructors[constr.value] : undefined}
          />
          <button
            type="button"
            className="bg-gray-500 mr-4  text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              dispatch({
                type: 'GO_TO',
                payload: { step: 1 },
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
              dispatch({
                type: 'STEP_2_COMPLETE',
                payload: { constructorName: constr.name, argValues },
              })
            }
          >
            Next
          </button>
        </>
      )}
    </div>
  ) : null;
};

export default Step2;
