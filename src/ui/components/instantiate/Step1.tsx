import React, { useState, ChangeEvent } from 'react';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { Input } from '../Input';
import { FileInput } from '../FileInput';
import { convertMetadata } from 'canvas/util';
import { useCanvas } from 'ui/contexts';
import type { Abi, AnyJson, InstantiateAction } from 'types';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep?: number;
}

export const Step1 = ({ currentStep, dispatch }: Props) => {
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
      <Buttons>
        <Button
          className="mt-16"
          onClick={() => {
              metadata && dispatch({
                type: 'STEP_1_COMPLETE',
                payload: {
                  codeHash: hash,
                  metadata,
                  contractName: metadata.project.contract.name.toHuman(),
                },
              })
          }}
          isDisabled={!metadata || !hash}
          variant='primary'
        >
          Next
        </Button>
      </Buttons>
    </>
  );
};
