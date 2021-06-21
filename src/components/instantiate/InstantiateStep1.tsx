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
