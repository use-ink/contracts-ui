import React, { useEffect, useState } from 'react';
import { Input } from '../../Input';
import { createOptions } from 'canvas/util';
import type { KeyringPair, InstantiateHashAction, DropdownOption } from 'types';
import { AccountSelector } from 'ui/components/AccountSelector';

interface Props {
  keyringPairs: Partial<KeyringPair>[];
  dispatch: React.Dispatch<InstantiateHashAction>;
  contractName: string;
  currentStep: number;
}

export const Step2 = ({ dispatch, currentStep, keyringPairs, contractName }: Props) => {
  const [accountSelected, setAccountSelected] = useState<DropdownOption>();
  const [name, setName] = useState('');
  useEffect(() => {
    keyringPairs && setAccountSelected(createOptions(keyringPairs, 'pair')[0]);
  }, []);
  useEffect(() => {
    setName(contractName);
  }, [contractName]);

  if (currentStep !== 2) return null;

  return keyringPairs ? (
    <>
      <label
        htmlFor="selectAccount"
        className="inline-block mb-2 dark:text-gray-300 text-gray-700 text-sm"
      >
        Account
      </label>
      <AccountSelector
        keyringPairs={keyringPairs}
        selectedOption={accountSelected}
        changeHandler={(o: DropdownOption) => setAccountSelected(o)}
        className="mb-2"
      />
      <label
        htmlFor="account"
        className="text-sm inline-block mb-2 dark:text-gray-300 text-gray-700"
      >
        Contract name
      </label>
      <Input
        value={name}
        handleChange={e => setName(e.target.value)}
        placeholder="contract name"
        id={name}
      />
      <button
        type="button"
        className="text-xs bg-indigo-500 hover:bg-indigo-600 mr-4 text-gray-100 font-bold py-2 px-4 rounded mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!accountSelected}
        onClick={() =>
          dispatch({
            type: 'STEP_2_COMPLETE',
            payload: {
              fromAddress: accountSelected?.value.toString() || '',
              fromAccountName: accountSelected?.name.toString() || '',
              contractName: name,
            },
          })
        }
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
  ) : null;
};
