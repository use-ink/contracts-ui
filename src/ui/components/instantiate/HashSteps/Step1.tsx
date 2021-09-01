import React, { useState, ChangeEvent, useEffect } from 'react';
import { Input } from '../../Input';
import { FileInput } from '../../FileInput';
import { convertMetadata, createOptions } from 'canvas/util';
import type {
  Abi,
  AnyJson,
  InstantiateAction,
  KeyringPair,
  DropdownOption,
  ApiPromise,
} from 'types';
import { AccountSelector } from 'ui/components/AccountSelector';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  keyringPairs: Partial<KeyringPair>[];
  dispatch: React.Dispatch<InstantiateAction>;
  api: ApiPromise;
  currentStep: number;
}

export const Step1 = ({ dispatch, currentStep, keyringPairs, api }: Props) => {
  const [metadata, setMetadata] = useState<Abi>();
  const [hash, setHash] = useState('');
  const [accountSelected, setAccountSelected] = useState<DropdownOption>();
  const [name, setName] = useState('');

  useEffect(() => {
    keyringPairs && setAccountSelected(createOptions(keyringPairs, 'pair')[0]);
  }, []);

  function handleUploadMetadata(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.item(0);
    const fr = new FileReader();

    fr.onload = function (e) {
      const result = JSON.parse(`${e.target?.result}`) as AnyJson;
      const converted = convertMetadata(result, api);
      setMetadata(converted);
      setName(`${converted?.project.contract.name}.contract`);
    };
    if (file) fr.readAsText(file);
  }

  if (currentStep !== 1) return null;

  return (
    <>
      <label htmlFor="hash" className="text-sm inline-block mb-2 dark:text-gray-300 text-gray-700">
        Look up Code Hash
      </label>
      <Input
        value={hash}
        handleChange={e => setHash(e.target.value)}
        placeholder="on-chain code hash"
        id="codeHash"
      />

      <label
        htmlFor="selectAccount"
        className="inline-block mb-2 dark:text-gray-300 text-gray-700 text-sm"
      >
        Account
      </label>
      <AccountSelector
        keyringPairs={keyringPairs}
        selectedOption={accountSelected}
        changeHandler={(o: DropdownOption) => setAccountSelected(o)}
        className="mb-2"
      />

      <label
        htmlFor="account"
        className="text-sm inline-block mb-2 dark:text-gray-300 text-gray-700"
      >
        Contract name
      </label>
      <Input
        value={name}
        handleChange={e => setName(e.target.value)}
        placeholder="contract name"
        id={name}
      />

      <label
        htmlFor="metadata"
        className="text-sm inline-block mb-2 dark:text-gray-300 text-gray-700"
      >
        Add contract metadata
      </label>
      <FileInput
        placeholder="Upload metadata.json"
        changeHandler={handleUploadMetadata}
        removeHandler={() => setMetadata(undefined)}
        fileLoaded={!!metadata}
        acceptAllFiles={false}
        successText={`${metadata?.project.contract.name} - v${metadata?.project.contract.version}`}
      />

      <button
        type="button"
        className="btn-primary"
        onClick={() =>
          metadata &&
          dispatch({
            type: 'UPLOAD_METADATA',
            payload: {
              codeHash: hash,
              metadata,
              contractName: metadata.project.contract.name.toHuman(),
              fromAddress: accountSelected?.value.toString() || '',
              fromAccountName: accountSelected?.name.toString() || '',
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
