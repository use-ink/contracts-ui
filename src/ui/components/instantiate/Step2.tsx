import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from '../Dropdown';
import { Input } from '../Input';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { createOptions } from 'canvas/util';
import type { KeyringPair, InstantiateAction, DropdownOption } from 'types';

interface Props {
  keyringPairs: Partial<KeyringPair>[];
  dispatch: React.Dispatch<InstantiateAction>;
  contractName: string;
  currentStep: number;
}

export const Step2 = ({ dispatch, currentStep, keyringPairs, contractName }: Props) => {
  const options = useMemo(
    (): DropdownOption[] => createOptions(keyringPairs, 'pair'),
    []
  );
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
        className="mb-4"
        value={account}
        onChange={setAccount}
      >
        No accounts found
      </Dropdown>
      <label htmlFor="account" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Contract name
      </label>
      <Input
        value={name}
        handleChange={e => setName(e.target.value)}
        placeholder="contract name"
        id={name}
      />
      <Buttons>
        <Button
          isDisabled={!account}
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
          variant='primary'
        >
          Next
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: 'GO_TO',
              payload: { step: 1 },
            })
          }
        >
          Go Back
        </Button>
      </Buttons>
    </>
  ) : null;
};
