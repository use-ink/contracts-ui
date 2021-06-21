import React, { useEffect, useState } from 'react';
import { AbiMessage, KeyringPair, InstantiateAction } from '../../types';
import { createEmptyValues, createOptions } from '../../canvas';
import useDropdown from '../useDropdown';
import ArgumentForm from '../ArgumentForm';

interface Props {
  keyringPairs: Partial<KeyringPair>[];
  constructors?: Partial<AbiMessage>[];
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep: number;
}

const Step2 = ({ constructors, dispatch, currentStep, keyringPairs }: Props) => {
  const [accountSelected, AccountDropdown, setAccountSelected] = useDropdown();
  const [constr, ConstructorDropdown, setConstructor] = useDropdown();
  const [argValues, setArgValues] = useState<Record<string, string>>();
  function handleArgValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    argValues && setArgValues({ ...argValues, [e.target.name]: e.target.value.trim() });
  }
  useEffect(() => {
    keyringPairs && setAccountSelected(createOptions(keyringPairs, 'pair')[0]);
  }, []);
  useEffect(() => {
    constructors && setConstructor(createOptions(constructors, 'message')[0]);
  }, [constructors]);

  useEffect(() => {
    constr && constructors && setArgValues(createEmptyValues(constructors[0].args));
  }, [constr]);

  if (currentStep !== 2) return null;

  return constructors ? (
    <div className="w-full max-w-xl mt-8">
      <AccountDropdown
        options={createOptions(keyringPairs, 'pair')}
        placeholder="No accounts found"
        className="mb-4"
      />
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
              argValues &&
              dispatch({
                type: 'STEP_2_COMPLETE',

                payload: {
                  constructorName: constr.name,
                  fromAddress: accountSelected.value.toString(),
                  argValues,
                },
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
