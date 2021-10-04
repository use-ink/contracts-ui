import React, { useEffect, useState } from 'react';
import { Input } from '../Input';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { AccountSelect } from '../AccountSelect';
import type { KeyringPair, InstantiateAction } from 'types';
import { useAccountId } from 'ui/hooks/useAccountId';

interface Props {
  keyringPairs: Partial<KeyringPair>[];
  dispatch: React.Dispatch<InstantiateAction>;
  contractName: string;
  currentStep: number;
}

export const Step2 = ({ dispatch, currentStep, keyringPairs, contractName }: Props) => {
  const { value: accountId, onChange: setAccountId } = useAccountId();
  const [name, setName] = useState('');

  useEffect(() => {
    setName(contractName);
  }, [contractName]);

  if (currentStep !== 2) return null;

  return keyringPairs ? (
    <>
      <label htmlFor="account" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Account
      </label>
      <AccountSelect
        className="mb-4"
        value={accountId}
        onChange={setAccountId}
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
      <Buttons>
        <Button
          isDisabled={!accountId}
          onClick={() =>
            dispatch({
              type: 'STEP_2_COMPLETE',
              payload: {
                fromAddress: accountId?.toString() || '',
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
