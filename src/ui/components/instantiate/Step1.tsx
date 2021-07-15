import React, { useState, ChangeEvent } from 'react';
import { FileInput } from '../FileInput';
import { Input } from '../Input';
import { Abi, AnyJson, InstantiateAction } from '../../../types';
import { convertMetadata } from '@canvas/util';
import { useCanvas } from '@ui/contexts';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep?: number;
}

export const Step1 = ({ dispatch, currentStep }: Props) => {
  const [metadata, setMetadata] = useState<Abi>();
  const [hash, setHash] = useState('');
  const { api } = useCanvas();

  function handleUploadMetadata(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.item(0);
    const fr = new FileReader();

    fr.onload = function (e) {
      const result = JSON.parse(`${e.target?.result}`) as AnyJson;
      const converted = convertMetadata(result, api);
      setMetadata(converted);
    };
    if (file) fr.readAsText(file);
  }

  if (currentStep !== 1) return null;

  return (
    <>
      <label htmlFor="hash" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Look up Code Hash
      </label>
      <Input
        value={hash}
        handleChange={e => setHash(e.target.value)}
        placeholder="on-chain code hash"
        id="codeHash"
      />
      <label htmlFor="metadata" className="inline-block mb-3 dark:text-gray-300 text-gray-700">
        Add contract metadata
      </label>
      <FileInput
        placeholder="Upload metadata.json"
        changeHandler={handleUploadMetadata}
        removeHandler={() => setMetadata(undefined)}
        fileLoaded={!!metadata}
        successText={`${metadata?.project.contract.name} - v${metadata?.project.contract.version}`}
      />

      <button
        type="button"
        className="bg-indigo-500 hover:bg-indigo-600 mr-4 text-gray-100 font-bold py-2 px-4 rounded mt-16 disabled:opacity-50 disabled:cursor-not-allowed"
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
