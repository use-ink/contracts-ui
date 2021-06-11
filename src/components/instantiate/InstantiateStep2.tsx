import React, { useEffect } from 'react';
import { Abi, InstantiateAction } from '../../types';
import { createEmptyValues, createOptionsConstructor } from '../../canvas';
import useDropdown from '../useDropdown';
import useArgumentForm from '../ArgumentForm';

interface Props {
  metadata?: Abi;
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep: number;
}

const Step2 = ({ metadata, dispatch, currentStep }: Props) => {
  const [constr, ConstructorDropdown, setConstructor] = useDropdown<number>();
  const [argValues, ArgumentForm, setArgValues] = useArgumentForm();

  useEffect(() => {
    metadata && setConstructor(createOptionsConstructor(metadata.constructors)[0]);
  }, [metadata]);

  useEffect(() => {
    constr && metadata && setArgValues(createEmptyValues(metadata.constructors[0].args));
  }, [constr]);

  if (currentStep !== 2) return null;

  return metadata ? (
    <div className="w-full max-w-xl mt-8">
      <ConstructorDropdown
        options={createOptionsConstructor(metadata.constructors)}
        placeholder="no constructors found"
        className="mb-4"
      />
      {constr && (
        <>
          <ArgumentForm
            key={`args-${constr.name}`}
            message={metadata.findConstructor(constr.name)}
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
