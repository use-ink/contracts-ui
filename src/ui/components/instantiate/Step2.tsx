import React, { useEffect, useState } from 'react';
import { Dropdown } from '../Dropdown';
import { Input } from '../Input';
import { createOptions } from 'canvas/util';
import type { KeyringPair, InstantiateAction, DropdownOption } from 'types';

interface Props {
  keyringPairs: Partial<KeyringPair>[];
  dispatch: React.Dispatch<InstantiateAction>;
  contractName: string;
  currentStep: number;
}

export const Step2 = ({ dispatch, currentStep, keyringPairs, contractName }: Props) => {
  const options = createOptions(keyringPairs, 'pair');
  const [account, setAccount] = useState<DropdownOption>(options[0]);
  const [name, setName] = useState('');
  // useEffect(() => {
  //   keyringPairs && setAccount(createOptions(keyringPairs, 'pair')[0]);
  // }, []);
  useEffect(() => {
    setName(contractName);
  }, [contractName]);

  if (currentStep !== 2) return null;

  return keyringPairs ? (
    <>
      <label htmlFor="account" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Account
      </label>
      <Dropdown
        options={options}
        placeholder="No accounts found"
        className="mb-4"
        value={account}
        onChange={setAccount}
      />
      <label htmlFor="account" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
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
        className="bg-indigo-500 hover:bg-indigo-600 mr-4 text-gray-100 font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!account}
        onClick={() =>
          dispatch({
            type: 'STEP_2_COMPLETE',
            payload: {
              fromAddress: account?.value.toString() || '',
              fromAccountName: account?.name.toString() || '',
              contractName: name,
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
            payload: { step: 1 },
          })
        }
      >
        Go Back
      </button>
    </>
  ) : null;
};
