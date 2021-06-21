import React, { useEffect, useState } from 'react';
import { KeyringPair, InstantiateAction } from '../../types';
import { createOptions } from '../../canvas';
import useMetadataFile from '../useMetadataFile';
import useDropdown from '../useDropdown';
import Input from '../Input';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  keyringPairs: Partial<KeyringPair>[];
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep?: number;
}

const Step1 = ({ keyringPairs, dispatch, currentStep }: Props) => {
  const [accountSelected, AccountDropdown, setAccountSelected] = useDropdown();
  const [metadata, MetadataFileInput] = useMetadataFile();
  const [hash, setHash] = useState('');

  useEffect(() => {
    keyringPairs && setAccountSelected(createOptions(keyringPairs, 'pair')[0]);
  }, []);

  if (currentStep !== 1) return null;

  return (
    <>
      <AccountDropdown
        options={createOptions(keyringPairs, 'pair')}
        placeholder="No accounts found"
        className="mb-4"
      />
      <Input
        value={hash}
        handleChange={e => setHash(e.target.value)}
        placeholder="on-chain code hash"
      />
      <MetadataFileInput />
      <button
        type="button"
        className="bg-gray-500 mr-4  text-white font-bold py-2 px-4 rounded mt-16 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() =>
          metadata &&
          dispatch({
            type: 'STEP_1_COMPLETE',
            payload: {
              codeHash: hash,
              fromAddress: accountSelected.value.toString(),
              metadata,
            },
          })
        }
        disabled={metadata ? false : true}
      >
        Next
      </button>
    </>
  );
};
export default Step1;
