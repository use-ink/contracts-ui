import React, { useEffect } from 'react';
import { KeyringPair, InstantiateAction } from '../../types';
import { createOptions } from '../../canvas';
import useMetadataFile from '../useMetadataFile';
import useDropdown from '../useDropdown';

interface Props {
  keyringPairs: Partial<KeyringPair>[];
  codeHashes: string[];
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep?: number;
}

const Step1 = ({ keyringPairs, codeHashes, dispatch, currentStep }: Props) => {
  const [accountSelected, AccountDropdown, setAccountSelected] = useDropdown();
  const [codeHash, CodeHashDropdown, setHash] = useDropdown();
  const [metadata, MetadataFileInput] = useMetadataFile();

  useEffect(() => {
    keyringPairs && setAccountSelected(createOptions(keyringPairs, 'pair')[0]);
  }, []);

  useEffect(() => {
    codeHashes && setHash(createOptions(codeHashes)[0]);
  }, [codeHashes]);

  if (currentStep !== 1) return null;

  return (
    <>
      <AccountDropdown
        options={createOptions(keyringPairs, 'pair')}
        placeholder="No accounts found"
        className="mb-4"
      />
      <CodeHashDropdown
        options={createOptions(codeHashes)}
        placeholder="No hashes found on chain"
        className="mb-8"
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
              codeHash: codeHash.value.toString(),
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
