import React, { useState, ChangeEvent, useEffect } from 'react';
import { u8aToString } from '@polkadot/util';
import { FileInput } from '../FileInput';
import { Input } from '../Input';
import { AccountSelector } from '../AccountSelector';
import {
  Abi,
  AnyJson,
  ApiPromise,
  DropdownOption,
  FileState,
  InstantiateCodeAction,
  KeyringPair,
} from 'types';
import { convertMetadata, convertToUint8Array, createOptions, NOOP } from 'canvas/util';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  keyringPairs: Partial<KeyringPair>[];
  dispatch: React.Dispatch<InstantiateCodeAction>;
  api: ApiPromise;
  currentStep?: number;
}

export const CodeStep1 = ({ keyringPairs, dispatch, api, currentStep }: Props) => {
  const [metadata, setMetadata] = useState<Abi>();
  const [file, setFile] = useState<FileState | null>();
  const [accountSelected, setAccountSelected] = useState<DropdownOption>();
  const [contractName, setContractName] = useState('');

  function handleUploadContract(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.item(0);
    const name = file?.name || '';
    const reader = new FileReader();
    reader.onabort = NOOP;
    reader.onerror = NOOP;

    reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
      if (target && target.result) {
        const data = convertToUint8Array(target?.result as ArrayBuffer);
        const metadata = convertMetadata(u8aToString(data) as AnyJson, api);
        setMetadata(metadata);
        setFile({ data, name: name, size: data.length } as FileState);
        setContractName(`${metadata?.project.contract.name}.contract`);
      }
    };

    if (file) reader.readAsArrayBuffer(file);
  }

  useEffect(() => {
    setAccountSelected(createOptions(keyringPairs, 'pair')[0]);
  }, []);

  if (currentStep !== 1) return null;

  return (
    <>
      <AccountSelector
        keyringPairs={keyringPairs}
        selectedOption={accountSelected}
        changeHandler={(o: DropdownOption) => setAccountSelected(o)}
      />

      <label htmlFor="contractName" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Contract Name
      </label>
      <Input
        value={contractName}
        handleChange={e => setContractName(e.target.value)}
        placeholder="Give your contract a descriptive name"
        id="contractName"
      />

      <label htmlFor="metadata" className="inline-block mb-2 dark:text-gray-300 text-gray-700">
        Upload Contract Bundle
      </label>
      <FileInput
        placeholder="Click to select or drag & drop to upload file."
        changeHandler={handleUploadContract}
        removeHandler={() => setFile(undefined)}
        fileLoaded={!!file}
        acceptAllFiles={true}
        successText={`${metadata?.project.contract.name}.contract`}
      />

      <button
        type="button"
        className="bg-indigo-500 hover:bg-indigo-600 mr-4 text-gray-100 font-bold py-2 px-4 rounded mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => {
          metadata &&
            dispatch({
              type: 'STEP_1_COMPLETE',
              payload: {
                metadata,
                fromAccountName: accountSelected?.name.toString() || '',
                fromAddress: accountSelected?.value.toString() || '',
                contractName: metadata.project.contract.name.toHuman(),
                file: file as FileState,
              },
            });
        }}
        disabled={false}
      >
        Next
      </button>
    </>
  );
};
