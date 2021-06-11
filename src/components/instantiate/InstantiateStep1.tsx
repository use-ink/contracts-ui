import React, { useEffect } from 'react';
import { KeyringPair, InstantiateAction } from '../../types';
import { createOptions, createValuesHash } from '../../canvas';
import { useCanvas } from '../../contexts';
import useMetadataFile from '../useMetadataFile';
import useDropdown from '../useDropdown';

interface Props {
  keyringPairs: KeyringPair[];
  codeHashes: string[];
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep?: number;
}

const Step1 = ({ keyringPairs, codeHashes, dispatch, currentStep }: Props) => {
  const { keyringState } = useCanvas();
  const [accountSelected, AccountDropdown, setAccountSelected] = useDropdown<string>();
  const [codeHash, CodeHashDropdown, setHash] = useDropdown<string>();
  const [metadata, MetadataFileInput] = useMetadataFile();

  useEffect(() => {
    keyringPairs && setAccountSelected(createOptions(keyringPairs)[0]);
  }, [keyringState]);

  useEffect(() => {
    codeHashes && setHash(createValuesHash(codeHashes)[0]);
  }, [codeHashes]);

  if (currentStep !== 1) return null;

  return (
    <>
      <AccountDropdown
        options={createOptions(keyringPairs)}
        placeholder="No accounts found"
        className="mb-4"
      />
      <CodeHashDropdown
        options={createValuesHash(codeHashes)}
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
            payload: { codeHash: codeHash.value, fromAddress: accountSelected.value, metadata },
          })
        }
        disabled={!metadata}
      >
        Next
      </button>
    </>
  );
};
export default Step1;
