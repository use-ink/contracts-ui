import React, { useEffect } from 'react';
import { KeyringPair, InstantiateAction } from '../../types';
import { createOptions } from '../../canvas';
import useDropdown from '../useDropdown';

interface Props {
  keyringPairs: Partial<KeyringPair>[];
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep: number;
}

const Step2 = ({ dispatch, currentStep, keyringPairs }: Props) => {
  const [accountSelected, AccountDropdown, setAccountSelected] = useDropdown();

  useEffect(() => {
    keyringPairs && setAccountSelected(createOptions(keyringPairs, 'pair')[0]);
  }, []);

  if (currentStep !== 2) return null;

  return keyringPairs ? (
    <div className="w-full max-w-xl mt-8">
      <AccountDropdown
        options={createOptions(keyringPairs, 'pair')}
        placeholder="No accounts found"
        className="mb-4"
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
        disabled={!accountSelected}
        onClick={() =>
          dispatch({
            type: 'STEP_2_COMPLETE',
            payload: {
              fromAddress: accountSelected.value.toString(),
            },
          })
        }
      >
        Next
      </button>
    </div>
  ) : null;
};

export default Step2;
