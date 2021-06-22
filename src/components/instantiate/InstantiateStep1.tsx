import React, { useState } from 'react';
import { InstantiateAction } from '../../types';
import useMetadataFile from '../useMetadataFile';
import Input from '../Input';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep?: number;
}

const Step1 = ({ dispatch, currentStep }: Props) => {
  const [metadata, MetadataFileInput] = useMetadataFile();
  const [hash, setHash] = useState('');

  if (currentStep !== 1) return null;

  return (
    <>
      <label htmlFor="hash" className="inline-block mb-2">
        Look up Code Hash
      </label>
      <Input
        value={hash}
        handleChange={e => setHash(e.target.value)}
        placeholder="on-chain code hash"
        id="codeHash"
      />
      <label htmlFor="metadata" className="inline-block mb-2">
        Upload metadata
      </label>
      <MetadataFileInput />
      <button
        type="button"
        className="bg-gray-500 mr-4 text-white font-bold py-2 px-4 rounded mt-16 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() =>
          metadata &&
          dispatch({
            type: 'STEP_1_COMPLETE',
            payload: {
              codeHash: hash,
              metadata,
              contractName: metadata.project.contract.name.toHuman(),
            },
          })
        }
        disabled={metadata && hash ? false : true}
      >
        Next
      </button>
    </>
  );
};
export default Step1;
